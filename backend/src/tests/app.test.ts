///////////////////////////////////////////
// Connection to server.ts
///////////////////////////////////////////

const request = require("supertest");
const app = require("../app.ts");
const requestWithSupertest = request(app);
const mongoose = require("mongoose");

///////////////////////////////////////////
// 1) Test login
///////////////////////////////////////////

let token = "";

describe("Test login", () => {
  const loginDetails = {
    email: "tester@gmail.com",
    password: "tester",
  };

  it("Test login", async () => {
    const res = await requestWithSupertest
      .post("/sessions/login")
      // send user login details
      .send(loginDetails);
    expect(res.status).toEqual(200);
    token = res.body.jwtTokens.accessToken;
  });
});

///////////////////////////////////////////
// 2) Test add new faovourite
///////////////////////////////////////////

describe("Add new favourite", () => {
  const newFavourite = {
    type: "repo",
    userId: 123456,
    avatar: "https://avatars.githubusercontent.com/u/61914660?v=4",
    username: "test",
    profileLink: "https://github.com/users/test",
    repoId: 123456,
    reponame: "test",
    repoLink: "https://github.com/muiboonyang/test",
  };

  afterAll(async () => {
    const res = await requestWithSupertest
      .get("/favourites/")
      .set("Authorization", `Bearer ${token}`);

    const lastItem = res.body[res.body.length - 1];

    await requestWithSupertest
      .delete(`/favourites/delete/${lastItem._id}`)
      .set("Authorization", `Bearer ${token}`);
  });

  afterAll(() => {
    mongoose.connection.close();
  });

  it("Create Favourite - Should add new favourite", async () => {
    await requestWithSupertest
      .post("/favourites/new")
      .set("Authorization", `Bearer ${token}`)
      .send(newFavourite);

    const res = await requestWithSupertest
      .get("/favourites/")
      .set("Authorization", `Bearer ${token}`);

    const lastItem = res.body[res.body.length - 1];

    expect(res.status).toEqual(200);
    expect(lastItem.type).toEqual(newFavourite["type"]);
    expect(lastItem.email).toEqual("tester@gmail.com");
    expect(lastItem.userId).toEqual(newFavourite["userId"]);
  });

  afterAll(() => {
    mongoose.connection.close();
  });
});
