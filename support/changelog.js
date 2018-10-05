const { spawn, exec, execSync } = require("child_process");
const { inspect } = require("util");
const { resolve } = require("path");
const { writeFile } = require("fs");
const { stripIndents } = require("common-tags");
const { format } = require("date-fns");
const parseChangelog = require("changelog-parser");
const parseCommit = require("conventional-commits-parser").sync;
const nunjucks = require("nunjucks");
const _ = require("lodash");

/**
 * The purpose of this file is to parse all commits since the last release tag
 * v*.*.* and update the contents of CHANGELOG.md to prepare for a new release.
 */

const repo = "https://github.com/Esri/arcgis-rest-js";

function getTags() {
  return new Promise((resolve, reject) => {
    let tags = [];
    const log = spawn("git", ["tag", "-l", "v*", "--sort", "v:refname"]);

    log.stdout.on("data", data => {
      tags = tags.concat(data.toString().split("\n"));
    });

    log.on("close", code => {
      resolve(_.compact(tags));
    });
  });
}

function getFirstCommit() {
  return new Promise((resolve, reject) => {
    let commits = [];
    const log = spawn("git", [
      "rev-list",
      "--max-parents=0",
      "HEAD",
      "--reverse"
    ]);

    log.stdout.on("data", data => {
      commits = commits.concat(data.toString().split("\n"));
    });

    log.on("close", code => {
      resolve(commits[0]);
    });
  });
}

function getCommitData(from, to) {
  return new Promise((resolve, reject) => {
    const hash = "%H";
    const shortHash = "%h";
    const authorName = "%an";
    const authorEmail = "%ae";
    const date = "%aI";
    const subject = "%s";
    const defaultFormat = {
      hash,
      shortHash,
      date,
      subject,
      author: { name: authorName, email: authorEmail }
    };

    const cmd = `git log ${from}..${to} --pretty=format:'${JSON.stringify(
      defaultFormat
    )},'`;

    exec(cmd, (err, stdout, stderr) => {
      if (err) return reject(err);
      if (stderr) return reject(stderr);
      /*
       order commits from most recent to least recent

       graveyard
       .replace(/"returns"/g, "returns")
       .replace(/\\/g, "\\\\")
       */
      const commits = JSON.parse("[" + stdout.slice(0, -1).replace(/"access"/g, "'access'") + "]").reverse();
      const today = new Date();
      resolve({
        previousVersion: /v\d\.\d\.\d/.test(from)
          ? from.replace("v", "")
          : from,
        version: to === "HEAD" ? getPackageVersion() : to.replace("v", ""),
        date: format(today, "MMMM Do YYYY"),
        commits
      });
    });
  });
}

function getPackageVersion() {
  return require(resolve(process.cwd(), "./lerna.json")).version;
}

function pairReleases(releases) {
  return Promise.all(
    releases.reduce((pairs, release, idx, allReleases) => {
      const nextRelease = allReleases[idx + 1];
      if (nextRelease) {
        pairs.push([release, nextRelease]);
      }

      return pairs;
    }, [])
  );
}

function processCommitMessages(releaseData) {
  return releaseData.map(release => {
    release.commits = _(release.commits)
      .map(commit => {
        const parsedCommit = parseCommit(
          execSync(
            `git log ${commit.hash} -n1 --pretty=format:'%B'`
          ).toString(),
          {
            mergePattern: /^Merge pull request #(\d+) from (.*)$/,
            mergeCorrespondence: ["id", "source"],
            noteKeywords: [
              "BREAKING CHANGE",
              "ISSUES CLOSED",
              "AFFECTS PACKAGES"
            ]
          }
        );

        if (!parsedCommit.type || !parsedCommit.scope) {
          return;
        }

        Object.assign(commit, parsedCommit);

        const breaking = commit.notes.findIndex(
          n => n.title === "BREAKING CHANGE"
        );

        if (breaking >= 0) {
          commit.breakingChanges = commit.notes[breaking].text;
        }

        const issues = commit.notes.findIndex(n => n.title === "ISSUES CLOSED");

        if (issues >= 0) {
          const issuesClosed = commit.notes[issues].text
            .replace(/\n.*/gm, "")
            .replace(/\s/g, "")
            .split(",")
            .map(i => i.replace("#", ""));

          const issuesReferenced = commit.references.map(r => r.issue);

          commit.relatedIssues = _.uniq(
            issuesClosed.concat(issuesReferenced)
          ).map(i => {
            return {
              issue: i,
              url: `${repo}/issues/${i}`
            };
          });
        }
        return commit;
      })
      .compact()
      .sortBy("type")
      .value();

    return release;
  });
}

function getPackagesForCommit(commit) {
  const idx = commit.notes.findIndex(note => note.title === "AFFECTS PACKAGES");
  if (idx >= 0) {
    const affectedPackages = commit.notes[idx].text.split("\n");
    return affectedPackages;
  }
  return ["Other Changes"];
}

function findReleasedPackages(releases) {
  return releases.map(release => {
    release.packages = release.commits.reduce((packages, commit) => {
      packages = packages.concat(getPackagesForCommit(commit));
      return _(packages).compact().uniq().sortBy(p => p).value();
    }, []);
    return release;
  });
}

function hasBreakingChanges(commit) {
  return commit.notes.find(n => n.title === "BREAKING CHANGE");
}

function groupCommitsByPackage(releases) {
  return releases.map(release => {
    release.groups = release.packages.reduce((groups, package) => {
      const commitsForPackage = release.commits.filter(commit => {
        return getPackagesForCommit(commit).some(
          commitPackage => commitPackage === package
        );
      });

      const [breaking, nonBreaking] = _.partition(
        commitsForPackage,
        hasBreakingChanges
      );

      if (breaking.length === 0) {
        groups[package] = Object.assign(
          {},
          _.groupBy(_.sortBy(nonBreaking, "type"), "type")
        );
      } else {
        groups[package] = Object.assign(
          { breaking },
          _.groupBy(nonBreaking, "type")
        );
      }

      return groups;
    }, {});
    delete release.commits;
    return release;
  });
}

function getTypeName(type) {
  switch (type) {
    case "feat":
      return "New Features";
    case "fix":
      return "Bug Fixes";
    case "docs":
      return "Documentation";
    case "style":
      return "Code Style";
    case "Refactor":
      return "Refactoring";
    case "perf":
      return "Performance";
    case "test":
      return "Tests";
    case "chore":
      return "Chores";
    case "revert":
      return "Reverts";
    case "breaking":
      return "Breaking Changes";
    case "WIP":
      return "Work In Progress";
    default:
      return "Misc.";
  }
}

const template = stripIndents`
  {%- macro link(repo, shortHash, hash) -%}
    [\`{{ shortHash }}\`]({{repo}}/commit/{{ hash }})
  {%- endmacro %}

  {%- macro relatedIssues(issues) -%}
    {%- for i in issues -%}
    {{" "}}[#{{i.issue}}]({{i.url}})
    {%- endfor -%}
  {%- endmacro %}

  {%- for release in releases %}
    ## [{{ release.version }}] - {{ release.date }}
    {% for package, groups in release.groups %}
      ### {{ package }}

      {% for type, commits in groups -%}
        * {{ getTypeName(type) }}
        {% for c in commits -%}
        {{"   "}}* **{{ c.scope }}**: {{ c.subject }} {{link(repo, c.shortHash, c.hash)}}{{relatedIssues(c.relatedIssues)}}
        {% endfor %}
      {%- endfor %}
    {%- endfor %}
  {%- endfor %}
`;

function buildMarkdown(releases) {
  return nunjucks.renderString(template, { releases, getTypeName, repo });
}

logStep = v => {
  console.log(inspect(v, { depth: 7 }));
  return v;
};

const changeLogTemplate = stripIndents`
  # {{title}}

  {{description}}
  {{newVersion}}

  {%- for version in oldVersions %}
  ## {{version.title}}

  {{version.body}}
  {% endfor %}
  {% for link in links -%}
  [{{link.ref}}]: {{link.href}} "{{link.title}}"
  {% endfor -%}
`;

function getReleases() {
  return Promise.all([
    getTags(),
    getFirstCommit()
  ]).then(([releases, firstCommit]) => {
    if (releases.length === 0) {
      return [];
    }

    releases.unshift(firstCommit);
    releases.push("HEAD");
    return releases;
  });
}

function getChangelogData() {
  return new Promise((resolve, reject) => {
    parseChangelog("CHANGELOG.md", function(error, changelog) {
      if (error) {
        reject(error);
        return;
      }

      resolve(changelog);
    });
  });
}

function filterReleases(releases) {
  return releases.slice(-2);
}

getReleases()
  .then(releases => filterReleases(releases))
  .then(releases => pairReleases(releases))
  .then(pairs =>
    Promise.all(pairs.map(([from, to]) => getCommitData(from, to)))
  )
  .then(releaseData => processCommitMessages(releaseData))
  .then(releaseData => findReleasedPackages(releaseData))
  .then(releaseData => groupCommitsByPackage(releaseData))
  .then(releaseData => buildMarkdown(releaseData))
  .then(newVersion => {
    return Promise.all([
      getReleases().then(pairReleases),
      getChangelogData(),
      Promise.resolve(newVersion)
    ]);
  })
  .then(([pairs, changelog, newVersion]) => {
    const links = pairs.map(([from, to]) => {
      to = to === "HEAD" ? "v" + getPackageVersion() : to;
      return {
        ref: to.replace("v", ""),
        title: to,
        href: `${repo}/compare/${from}...${to}`
      };
    });

    if (links.length) {
      links.push({
        ref: "HEAD",
        title: "Unreleased Changes",
        href: `${repo}/compare/${_.last(links).title}...HEAD`
      });
    }

    const rendered = nunjucks.renderString(changeLogTemplate, {
      title: changelog.title,
      description: changelog.description,
      oldVersions: changelog.versions,
      newVersion: newVersion,
      links,
      repo
    });

    writeFile("CHANGELOG.md", rendered, function(e) {});
  })
  .catch(error => {
    console.error(error.stack);
  });
