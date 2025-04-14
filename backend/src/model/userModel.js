// root/backend/src/model/userModel.js
import db from "../config/knex.js";

export const findUserByMail = (email) => {
  try {
    console.log("Model: user found successfully");
    return db("users").where({ user_email: email }).first();
  } catch (error) {
    console.error("Model: Failed to retrieve user by mail", error);
    throw error;
  }
};

export const createUser = (userData) => {
  try {
    console.log("Model: user created successfully");
    return db("users").insert(userData).returning("*");
  } catch (error) {
    console.error("Model: Failed to create user", error);
    throw error;
  }
};

export const findUserById = (userId) => {
  try {
    return db("users")
      .select(
        "user_id as userId",
        "user_firstname as firstName",
        "user_lastname as lastName",
        "user_email as email",
        "user_phonenumber as phoneNumber",
        "user_role as role"
      )
      .where({ user_id: userId })
      .first();
  } catch (error) {
    console.error("Error fetching user by ID: ", error);
    throw Error;
  }
};

// function to count how many events has been created by an organizer
export const countEventsByUserId = async (userId) => {
  try {
    const gotProfile = await db("events")
      .where("organizer_id", userId)
      .count("event_id as count")
      .first();
    return gotProfile ? gotProfile.count : 0;
  } catch (error) {
    console.error("Error counting events for user:", error);
    throw error;
  }
};
