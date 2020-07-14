import express from "express";
import { json, urlencoded } from "body-parser";
import cors from "cors";
import http from "http";
import socketIO from "socket.io";
import { protect, register, login, join } from "./utils/auth";
import connect from "./utils/db";
import userRouter from "./resources/user/user.router";
import adminRouter from "./resources/admin/admin.router";
import chatRouter from "./resources/chat/chat.router";
import eventRouter from "./resources/event/event.router";
import roomRouter from "./resources/room/room.router";
import morgan from "morgan";

// PORT INITIALIZE
const PORT = process.env.PORT || 5000;

// CONFIGURE EXPRESS APP
export const app = express();
app.use(morgan("dev"));
app.disable("x-powered-by");
app.use(urlencoded({ extended: true }));
app.use(json());
app.use(cors());

// MIDDLEWARE

app.post("/register", register);
app.post("/login", login);
app.post("/join", join);

//CONFIGURE ROUTE
app.use("/api", protect);
app.use("/api/user", userRouter);
app.use("/api/room", roomRouter);
app.use("/api/chat", chatRouter);
app.use("/api/admin", adminRouter);
app.use("/api/event", eventRouter);

app.use("/", (req,res)=>{
  res.send("<h1> Your API is working :) </h1>");
})
//CREATE SERVER
const httpServer = http.createServer(app);

//INITIALIZE A SOCKET IO connection ON APP
const io = socketIO(httpServer);
io.on("connection", (socket) => {
  console.log("There is a new connection");

  //BROADCAST THE MESSAGE
  socket.on("chat message", (msg) => {
    io.on(msg.room).emit("chat message", msg);
  });

  //INDICATE A USER JOINED THE APP
  socket.on("user joined", (user) => {
    console.log(`A user has joined: ${JSON.stringify(user)}`);
    //Broadcast user
    io.emit("user joined", user);
  });

  // INDICATE WHEN USER LEFT THE APP
  socket.on("user left", (user) => {
    io.emit("user left", user);
  });

  //JOINED A ROOM
  socket.join("join room", (joinRoomEvent) => {
    const { room } = joinRoomEvent;
    console.log(`Joind room: ${JSON.stringify(joinRoomEvent)}`);
    socket.join(room);
    io.to(room).emit("join room", joinRoomEvent);
  });

  //LEAVE ROOM
  socket.leave("leave room", (leaveRoomEvent) => {
    const { room } = leaveRoomEvent;
    console.log(`Leave room: ${JSON.stringify(leaveRoomEvent)}`);
    io.to(room).emit("leave room", leaveRoomEvent);
    socket.leave(room);
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} had left!`);
  });
});

const start = async () => {
  try {
    // await to connect to database
    await connect();
    httpServer.listen(PORT, () => {
      console.log(`REST API on http://localhost:${PORT}`);
    });
  } catch (e) {
    console.error(e);
  }
};

start();
