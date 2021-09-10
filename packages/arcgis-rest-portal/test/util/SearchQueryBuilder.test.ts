/* Copyright (c) 2019 Environmental Systems Research Institute, Inc.
 * Apache-2.0 */

import { SearchQueryBuilder } from "../../src/util/SearchQueryBuilder";

describe("SearchQueryBuilder", () => {
  const originalWarn = console.warn;

  beforeAll(function() {
    console.warn = jasmine.createSpy().and.callFake(() => {
      return;
    });
  });

  afterAll(function() {
    console.warn = originalWarn;
  });

  it("should return an empty string when called with no other functions", () => {
    const query = new SearchQueryBuilder().toParam();
    expect(query).toEqual("");
  });

  it("should format a simple search query", () => {
    const query = new SearchQueryBuilder().match("test").toParam();
    expect(query).toEqual("test");
  });

  it("should format a simple search query in a field", () => {
    const query = new SearchQueryBuilder()
      .match("test")
      .in("tags")
      .toParam();
    expect(query).toEqual("tags:test");
  });

  it("should warp multi word search terms in quotes", () => {
    const query = new SearchQueryBuilder().match("foo bar").toParam();
    expect(query).toEqual(`"foo bar"`);
  });

  it("should wrap multi word search terms with colons in quotes", () => {
    const query = new SearchQueryBuilder().match("foo:bar").toParam();
    expect(query).toEqual(`"foo:bar"`);
  });

  it("should accept .in() without a parameter", () => {
    const query = new SearchQueryBuilder()
      .match("test")
      .in()
      .toParam();
    expect(query).toEqual(`test`);
  });

  it("should accept `*` as a value for .in()", () => {
    const query = new SearchQueryBuilder()
      .match("test")
      .in("*")
      .toParam();
    expect(query).toEqual(`test`);
  });

  it("should chain calls with .and()", () => {
    const query = new SearchQueryBuilder()
      .match("bar")
      .and()
      .match("foo")
      .in("tags")
      .toParam();

    expect(query).toEqual("bar AND tags:foo");
  });

  it("should format a simple range", () => {
    const query = new SearchQueryBuilder()
      .from("a")
      .to("z")
      .in("title")
      .toParam();
    expect(query).toEqual("title:[a TO z]");
  });

  it("should format a simple group", () => {
    const query = new SearchQueryBuilder()
      .startGroup()
      .from("a")
      .to("z")
      .in("title")
      .endGroup()
      .toParam();
    expect(query).toEqual("(title:[a TO z])");
  });

  it("should format a more complex group", () => {
    const query = new SearchQueryBuilder()
      .startGroup()
      .match("California")
      .or()
      .match("recent")
      .endGroup()
      .and()
      .match("fires")
      .toParam();
    expect(query).toEqual("(California OR recent) AND fires");
  });

  it("should boost the previous search", () => {
    const query = new SearchQueryBuilder()
      .match("test")
      .boost(5)
      .toParam();
    expect(query).toEqual("test^5");
  });

  it("should convert dates into timestamps", () => {
    const date1 = new Date("January 1 2019");
    const date2 = new Date("January 7 2019");
    const expectedDate1 = date1.getTime();
    const expectedDate2 = date2.getTime();

    const query = new SearchQueryBuilder()
      .from(date1)
      .to(date2)
      .in("created")
      .and()
      .match("test")
      .in("tags")
      .toParam();

    expect(query).toEqual(
      `created:[${expectedDate1} TO ${expectedDate2}] AND tags:test`
    );
  });

  it("should format a complex group properly", () => {
    const query = new SearchQueryBuilder()
      .match("fred")
      .in("owner")
      .and()
      .startGroup()
      .match("Web Mapping Application")
      .in("type")
      .or()
      .match("Mobile Application")
      .in("type")
      .or()
      .match("Application")
      .in("type")
      .endGroup()
      .and()
      .match("test")
      .in("*")
      .toParam();

    expect(query).toEqual(
      `owner:fred AND (type:"Web Mapping Application" OR type:"Mobile Application" OR type:Application) AND test`
    );
  });

  it("should allow .not to be called without a preceding search value", () => {
    const query = new SearchQueryBuilder()
      .not()
      .match("public")
      .in("access")
      .not()
      .match("code attachment")
      .in("type")
      .toParam();

    expect(query).toEqual(`NOT access:public NOT type:"code attachment"`);
  });

  it("should clone searches for modification", () => {
    const myAppsQuery = new SearchQueryBuilder()
      .match("fred")
      .in("owner")
      .and()
      .startGroup()
      .match("Web Mapping Application")
      .in("type")
      .or()
      .match("Mobile Application")
      .in("type")
      .or()
      .match("Application")
      .in("type")
      .endGroup();

    const myTestAppsQuery = myAppsQuery
      .clone()
      .and()
      .match("test")
      .in("*");

    expect(myAppsQuery.toParam()).toEqual(
      `owner:fred AND (type:"Web Mapping Application" OR type:"Mobile Application" OR type:Application)`
    );

    expect(myTestAppsQuery.toParam()).toEqual(
      `owner:fred AND (type:"Web Mapping Application" OR type:"Mobile Application" OR type:Application) AND test`
    );
  });

  it("should not allow trailing modifiers, and warn user", () => {
    const query = new SearchQueryBuilder()
      .match("test")
      .not()
      .toParam();

    expect(console.warn).toHaveBeenCalled();
    expect(query).toEqual("test");
  });

  it("should not allow chains of logic modifiers, and warn user", () => {
    const query = new SearchQueryBuilder()
      .and()
      .or()
      .or()
      .toParam();

    expect(console.warn).toHaveBeenCalled();
    expect(query).toEqual("");
  });

  it("should not allow chains of logic modifiers after a .match, and warn user", () => {
    const query = new SearchQueryBuilder()
      .match("test")
      .not()
      .and()
      .toParam();

    expect(console.warn).toHaveBeenCalled();
    expect(query).toEqual("test");
  });

  it("should close groups on toParam(), and warn user", () => {
    const query = new SearchQueryBuilder()
      .startGroup()
      .match("test")
      .toParam();

    expect(console.warn).toHaveBeenCalled();
    expect(query).toEqual("(test)");
  });

  it("should close groups automatically on clone(), and warn user", () => {
    const query = new SearchQueryBuilder()
      .startGroup()
      .match("test")
      .clone()
      .toParam();

    expect(console.warn).toHaveBeenCalled();
    expect(query).toEqual("(test)");
  });

  it("should close more then 1 group, and warn user", () => {
    const query = new SearchQueryBuilder()
      .startGroup()
      .match("foo")
      .startGroup()
      .match("bar")
      .toParam();

    expect(console.warn).toHaveBeenCalled();
    expect(query).toEqual("(foo (bar))");
  });

  it("should not allow .in() without valid term or range and warn user", () => {
    const query = new SearchQueryBuilder()
      .in("tags")
      .in("title")
      .toParam();

    expect(console.warn).toHaveBeenCalled();
    expect(query).toEqual("");
  });

  it("should not allow .in() with only .from() and warn user", () => {
    const query = new SearchQueryBuilder()
      .from("a")
      .in("title")
      .toParam();

    expect(console.warn).toHaveBeenCalled();
    expect(query).toEqual("");
  });

  it("should not allow .in() with only .to() and warn user", () => {
    const query = new SearchQueryBuilder()
      .to("a")
      .in("title")
      .toParam();

    expect(console.warn).toHaveBeenCalled();
    expect(query).toEqual("");
  });

  it("should not allow .to() after a .match() and warn user", () => {
    const query = new SearchQueryBuilder()
      .match("test")
      .to("a")
      .toParam();

    expect(console.warn).toHaveBeenCalled();
    expect(query).toEqual("test");
  });

  it("should not allow .to() after a .match() and warn user", () => {
    const query = new SearchQueryBuilder()
      .match("test")
      .from("a")
      .toParam();

    expect(console.warn).toHaveBeenCalled();
    expect(query).toEqual("test");
  });

  it("should not allow .endGroup() without .startGroup()", () => {
    const query = new SearchQueryBuilder()
      .match("a")
      .in("title")
      .endGroup()
      .toParam();

    expect(console.warn).toHaveBeenCalled();
    expect(query).toEqual("title:a");
  });

  it("should not allow .match().from().in(), and warn user", () => {
    const query = new SearchQueryBuilder()
      .match("test")
      .from("a")
      .in("title")
      .toParam();

    expect(console.warn).toHaveBeenCalled();
    expect(query).toEqual("title:test");
  });

  it("should produce an empty string when no methods are called", () => {
    const query = new SearchQueryBuilder().toParam();
    expect(query).toEqual("");
  });
});
