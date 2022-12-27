/*
* Copyright (c) 2009, Jay Loden, Giampaolo Rodola'. All rights reserved.
* Use of this source code is governed by a BSD-style license that can be
* found in the LICENSE file.
*
* Helper functions related to fetching process information. Used by
* _psutil_windows module methods.
*/
#include "stdafx.h"
#include <windows.h>
#include <sstream>
#include <iostream>

// ====================================================================
// Helper structures to access the memory correctly.
// Some of these might also be defined in the winternl.h header file
// but unfortunately not in a usable way.
// ====================================================================

// see http://msdn2.microsoft.com/en-us/library/aa489609.aspx
#ifndef NT_SUCCESS
#define NT_SUCCESS(Status) ((NTSTATUS)(Status) >= 0)
#endif

typedef struct _PROCESS_BASIC_INFORMATION {
	PVOID Reserved1;
	PVOID PebBaseAddress;
	PVOID Reserved2[2];
	ULONG_PTR UniqueProcessId;
	PVOID Reserved3;
} PROCESS_BASIC_INFORMATION;


typedef struct _LSA_UNICODE_STRING {
	USHORT Length;
	USHORT MaximumLength;
	PWSTR  Buffer;
} LSA_UNICODE_STRING, *PLSA_UNICODE_STRING, UNICODE_STRING, *PUNICODE_STRING;

// http://msdn.microsoft.com/en-us/library/aa813741(VS.85).aspx
typedef struct {
	BYTE Reserved1[16];
	PVOID Reserved2[5];
	UNICODE_STRING CurrentDirectoryPath;
	PVOID CurrentDirectoryHandle;
	UNICODE_STRING DllPath;
	UNICODE_STRING ImagePathName;
	UNICODE_STRING CommandLine;
	LPCWSTR env;
} RTL_USER_PROCESS_PARAMETERS_, *PRTL_USER_PROCESS_PARAMETERS_;

// NtQueryInformationProcess for pure 32 and 64-bit processes
typedef NTSTATUS(NTAPI *_NtQueryInformationProcess)(
	IN HANDLE ProcessHandle,
	ULONG ProcessInformationClass,
	OUT PVOID ProcessInformation,
	IN ULONG ProcessInformationLength,
	OUT PULONG ReturnLength OPTIONAL
	);

// https://msdn.microsoft.com/en-us/library/aa813706(v=vs.85).aspx
#ifdef _WIN64
typedef struct {
	BYTE Reserved1[2];
	BYTE BeingDebugged;
	BYTE Reserved2[21];
	PVOID LoaderData;
	PRTL_USER_PROCESS_PARAMETERS_ ProcessParameters;
	/* More fields ...  */
} PEB_;
#else
typedef struct {
	BYTE Reserved1[2];
	BYTE BeingDebugged;
	BYTE Reserved2[1];
	PVOID Reserved3[2];
	PVOID Ldr;
	PRTL_USER_PROCESS_PARAMETERS_ ProcessParameters;
	/* More fields ...  */
} PEB_;
#endif

#ifdef _WIN64
/* When we are a 64 bit process accessing a 32 bit (WoW64) process we need to
use the 32 bit structure layout. */
typedef struct {
	USHORT Length;
	USHORT MaxLength;
	DWORD Buffer;
} UNICODE_STRING32;

typedef struct {
	BYTE Reserved1[16];
	DWORD Reserved2[5];
	UNICODE_STRING32 CurrentDirectoryPath;
	DWORD CurrentDirectoryHandle;
	UNICODE_STRING32 DllPath;
	UNICODE_STRING32 ImagePathName;
	UNICODE_STRING32 CommandLine;
	DWORD env;
} RTL_USER_PROCESS_PARAMETERS32;

typedef struct {
	BYTE Reserved1[2];
	BYTE BeingDebugged;
	BYTE Reserved2[1];
	DWORD Reserved3[2];
	DWORD Ldr;
	DWORD ProcessParameters;
	/* More fields ...  */
} PEB32;
#else
/* When we are a 32 bit (WoW64) process accessing a 64 bit process we need to
use the 64 bit structure layout and a special function to read its memory.
*/
typedef NTSTATUS(NTAPI *_NtWow64ReadVirtualMemory64)(
	IN HANDLE ProcessHandle,
	IN PVOID64 BaseAddress,
	OUT PVOID Buffer,
	IN ULONG64 Size,
	OUT PULONG64 NumberOfBytesRead);

typedef enum {
	MemoryInformationBasic
} MEMORY_INFORMATION_CLASS;

typedef NTSTATUS(NTAPI *_NtWow64QueryVirtualMemory64)(
	IN HANDLE ProcessHandle,
	IN PVOID64 BaseAddress,
	IN MEMORY_INFORMATION_CLASS MemoryInformationClass,
	OUT PMEMORY_BASIC_INFORMATION64 MemoryInformation,
	IN ULONG64 Size,
	OUT PULONG64 ReturnLength OPTIONAL);

typedef struct {
	PVOID Reserved1[2];
	PVOID64 PebBaseAddress;
	PVOID Reserved2[4];
	PVOID UniqueProcessId[2];
	PVOID Reserved3[2];
} PROCESS_BASIC_INFORMATION64;

typedef struct {
	USHORT Length;
	USHORT MaxLength;
	PVOID64 Buffer;
} UNICODE_STRING64;

typedef struct {
	BYTE Reserved1[16];
	PVOID64 Reserved2[5];
	UNICODE_STRING64 CurrentDirectoryPath;
	PVOID64 CurrentDirectoryHandle;
	UNICODE_STRING64 DllPath;
	UNICODE_STRING64 ImagePathName;
	UNICODE_STRING64 CommandLine;
	PVOID64 env;
} RTL_USER_PROCESS_PARAMETERS64;

typedef struct {
	BYTE Reserved1[2];
	BYTE BeingDebugged;
	BYTE Reserved2[21];
	PVOID64 LoaderData;
	PVOID64 ProcessParameters;
	/* More fields ...  */
} PEB64;
#endif


#define PSUTIL_FIRST_PROCESS(Processes) ( \
    (PSYSTEM_PROCESS_INFORMATION)(Processes))
#define PSUTIL_NEXT_PROCESS(Process) ( \
   ((PSYSTEM_PROCESS_INFORMATION)(Process))->NextEntryOffset ? \
   (PSYSTEM_PROCESS_INFORMATION)((PCHAR)(Process) + \
        ((PSYSTEM_PROCESS_INFORMATION)(Process))->NextEntryOffset) : NULL)

const int STATUS_INFO_LENGTH_MISMATCH = 0xC0000004;
const int STATUS_BUFFER_TOO_SMALL = 0xC0000023L;


// ====================================================================
// Process and PIDs utiilties.
// ====================================================================

enum psutil_process_data_kind {
	KIND_CMDLINE,
	KIND_CWD,
	KIND_ENVIRON,
};

/*
* A wrapper around OpenProcess setting NSP exception if process
* no longer exists.
* "pid" is the process pid, "dwDesiredAccess" is the first argument
* exptected by OpenProcess.
* Return a process handle or NULL.
*/
HANDLE
psutil_handle_from_pid_waccess(DWORD pid, DWORD dwDesiredAccess) {
	HANDLE hProcess;

	hProcess = OpenProcess(dwDesiredAccess, FALSE, pid);
	return hProcess;
}


/*
* Same as psutil_handle_from_pid_waccess but implicitly uses
* PROCESS_QUERY_INFORMATION | PROCESS_VM_READ as dwDesiredAccess
* parameter for OpenProcess.
*/
HANDLE
psutil_handle_from_pid(DWORD pid) {
	DWORD dwDesiredAccess = PROCESS_QUERY_INFORMATION | PROCESS_VM_READ;
	return psutil_handle_from_pid_waccess(pid, dwDesiredAccess);
}


/* Given a pointer into a process's memory, figure out how much data can be
* read from it. */
static int psutil_get_process_region_size(HANDLE hProcess,
	LPCVOID src,
	SIZE_T *psize) {
	MEMORY_BASIC_INFORMATION info;

	if (!VirtualQueryEx(hProcess, src, &info, sizeof(info))) {
		return -1;
	}

	*psize = info.RegionSize - ((char*)src - (char*)info.BaseAddress);
	return 0;
}

/* Get data from the process with the given pid.  The data is returned in the
pdata output member as a nul terminated string which must be freed on
success.

On success 0 is returned.  On error the output parameter is not touched, -1
is returned, and an appropriate Python exception is set. */
static int psutil_get_process_data(long pid,
	enum psutil_process_data_kind kind,
	WCHAR **pdata,
	SIZE_T *psize) {
	/* This function is quite complex because there are several cases to be
	considered:

	Two cases are really simple:  we (i.e. the python interpreter) and the
	target process are both 32 bit or both 64 bit.  In that case the memory
	layout of the structures matches up and all is well.

	When we are 64 bit and the target process is 32 bit we need to use
	custom 32 bit versions of the structures.

	When we are 32 bit and the target process is 64 bit we need to use
	custom 64 bit version of the structures.  Also we need to use separate
	Wow64 functions to get the information.

	A few helper structs are defined above so that the compiler can handle
	calculating the correct offsets.

	Additional help also came from the following sources:

	https://github.com/kohsuke/winp and
	http://wj32.org/wp/2009/01/24/howto-get-the-command-line-of-processes/
	http://stackoverflow.com/a/14012919
	http://www.drdobbs.com/embracing-64-bit-windows/184401966
	*/
	static _NtQueryInformationProcess NtQueryInformationProcess = NULL;
#ifndef _WIN64
	static _NtQueryInformationProcess NtWow64QueryInformationProcess64 = NULL;
	static _NtWow64ReadVirtualMemory64 NtWow64ReadVirtualMemory64 = NULL;
#endif
	HANDLE hProcess = NULL;
	LPCVOID src;
	SIZE_T size;
	WCHAR *buffer = NULL;
#ifdef _WIN64
	LPVOID ppeb32 = NULL;
#else
	PVOID64 src64;
	BOOL weAreWow64;
	BOOL theyAreWow64;
#endif

	hProcess = psutil_handle_from_pid(pid);
	if (hProcess == NULL)
		return -1;

	if (NtQueryInformationProcess == NULL) {
		NtQueryInformationProcess = (_NtQueryInformationProcess)GetProcAddress(
			GetModuleHandleA("ntdll.dll"), "NtQueryInformationProcess");
	}

#ifdef _WIN64
	/* 64 bit case.  Check if the target is a 32 bit process running in WoW64
	* mode. */
	if (!NT_SUCCESS(NtQueryInformationProcess(hProcess,
		ProcessWow64Information,
		&ppeb32,
		sizeof(LPVOID),
		NULL))) {
		PyErr_SetFromWindowsErr(0);
		goto error;
	}

	if (ppeb32 != NULL) {
		/* We are 64 bit.  Target process is 32 bit running in WoW64 mode. */
		PEB32 peb32;
		RTL_USER_PROCESS_PARAMETERS32 procParameters32;

		// read PEB
		if (!ReadProcessMemory(hProcess, ppeb32, &peb32, sizeof(peb32), NULL)) {
			PyErr_SetFromWindowsErr(0);
			goto error;
		}

		// read process parameters
		if (!ReadProcessMemory(hProcess,
			UlongToPtr(peb32.ProcessParameters),
			&procParameters32,
			sizeof(procParameters32),
			NULL)) {
			PyErr_SetFromWindowsErr(0);
			goto error;
		}

		switch (kind) {
		case KIND_CMDLINE:
			src = UlongToPtr(procParameters32.CommandLine.Buffer),
				size = procParameters32.CommandLine.Length;
			break;
		case KIND_CWD:
			src = UlongToPtr(procParameters32.CurrentDirectoryPath.Buffer);
			size = procParameters32.CurrentDirectoryPath.Length;
			break;
		case KIND_ENVIRON:
			src = UlongToPtr(procParameters32.env);
			break;
		}
	}
	else
#else
	/* 32 bit case.  Check if the target is also 32 bit. */
	if (!IsWow64Process(GetCurrentProcess(), &weAreWow64) ||
		!IsWow64Process(hProcess, &theyAreWow64)) {
		goto error;
	}

	if (weAreWow64 && !theyAreWow64) {
		/* We are 32 bit running in WoW64 mode.  Target process is 64 bit. */
		PROCESS_BASIC_INFORMATION64 pbi64;
		PEB64 peb64;
		RTL_USER_PROCESS_PARAMETERS64 procParameters64;

		if (NtWow64QueryInformationProcess64 == NULL) {
			NtWow64QueryInformationProcess64 =
				(_NtQueryInformationProcess)GetProcAddress(
					GetModuleHandleA("ntdll.dll"),
					"NtWow64QueryInformationProcess64");

			if (NtWow64QueryInformationProcess64 == NULL) {
				goto error;
			}
		}

		if (NtWow64QueryInformationProcess64(
			hProcess,
			0,
			&pbi64,
			sizeof(pbi64),
			NULL) != 0) {
			goto error;
		}

		// read peb
		if (NtWow64ReadVirtualMemory64 == NULL) {
			NtWow64ReadVirtualMemory64 =
				(_NtWow64ReadVirtualMemory64)GetProcAddress(
					GetModuleHandleA("ntdll.dll"),
					"NtWow64ReadVirtualMemory64");

			if (NtWow64ReadVirtualMemory64 == NULL) {
				goto error;
			}
		}

		if (!NT_SUCCESS(NtWow64ReadVirtualMemory64(hProcess,
			pbi64.PebBaseAddress,
			&peb64,
			sizeof(peb64),
			NULL))) {
			goto error;
		}

		// read process parameters
		if (!NT_SUCCESS(NtWow64ReadVirtualMemory64(hProcess,
			peb64.ProcessParameters,
			&procParameters64,
			sizeof(procParameters64),
			NULL))) {
			goto error;
		}

		switch (kind) {
		case KIND_CMDLINE:
			src64 = procParameters64.CommandLine.Buffer;
			size = procParameters64.CommandLine.Length;
			break;
		case KIND_CWD:
			src64 = procParameters64.CurrentDirectoryPath.Buffer,
				size = procParameters64.CurrentDirectoryPath.Length;
			break;
		case KIND_ENVIRON:
			src64 = procParameters64.env;
			break;
		}
	}
	else
#endif

		/* Target process is of the same bitness as us. */
	{
		PROCESS_BASIC_INFORMATION pbi;
		PEB_ peb;
		RTL_USER_PROCESS_PARAMETERS_ procParameters;

		if (NtQueryInformationProcess(hProcess,
			0,
			&pbi,
			sizeof(pbi),
			NULL) != 0) {
			goto error;
		}

		// read peb
		if (!ReadProcessMemory(hProcess,
			pbi.PebBaseAddress,
			&peb,
			sizeof(peb),
			NULL)) {
			goto error;
		}

		// read process parameters
		if (!ReadProcessMemory(hProcess,
			peb.ProcessParameters,
			&procParameters,
			sizeof(procParameters),
			NULL)) {
			goto error;
		}

		switch (kind) {
		case KIND_CMDLINE:
			src = procParameters.CommandLine.Buffer;
			size = procParameters.CommandLine.Length;
			break;
		case KIND_CWD:
			src = procParameters.CurrentDirectoryPath.Buffer;
			size = procParameters.CurrentDirectoryPath.Length;
			break;
		case KIND_ENVIRON:
			src = procParameters.env;
			break;
		}
	}

	buffer = (WCHAR *)calloc(size + 2, 1);

	if (buffer == NULL) {
		goto error;
	}

#ifndef _WIN64
	if (weAreWow64 && !theyAreWow64) {
		if (!NT_SUCCESS(NtWow64ReadVirtualMemory64(hProcess,
			src64,
			buffer,
			size,
			NULL))) {
			goto error;
		}
	}
	else
#endif
		if (!ReadProcessMemory(hProcess, src, buffer, size, NULL)) {
			goto error;
		}

	CloseHandle(hProcess);

	*pdata = buffer;
	*psize = size;

	return 0;

error:
	if (hProcess != NULL)
		CloseHandle(hProcess);
	if (buffer != NULL)
		free(buffer);
	return -1;
}

int main(int argc, char * argv[]) {
	long pid;
	if (argc >= 2) {
		std::istringstream ss(argv[1]);
		if (!(ss >> pid)) {
			return -1;
		}
	}
	WCHAR *str;
	SIZE_T size;
	if (psutil_get_process_data(pid, KIND_CWD, &str, &size) == 0) {
		std::wcout << str;
		return 0;
	}
	return -1;
}
