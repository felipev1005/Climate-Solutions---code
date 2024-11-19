/********************************************************************************
* WEB322 – Assignment 05
*
* I declare that this assignment is my own work in accordance with Seneca's
* Academic Integrity Policy:
*
* https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
*
* Name: Diego Felipe Villacres Guerrero Student ID: 121258230 Date:11/18/2024
*
* Published URL: https://assingment5.vercel.app/
//is not working :( it works when i put node server.js, but i do not know why it does not work when i upload ir)
*
********************************************************************************/
const projectData = require("./modules/projects");
const path = require("path");
const express = require("express");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("home", { page: "/" });
});

app.get("/about", (req, res) => {
  res.render("about", { page: "/about" });
});

app.get("/solutions/projects", async (req, res) => {
  try {
    if (req.query.sector) {
      let projects = await projectData.getProjectsBySector(req.query.sector);
      if (projects.length === 0) {
        res.status(404).render("404", { message: `No projects found for the sector: ${req.query.sector}` });
      } else {
        res.render("projects", { projects: projects });
      }
    } else {
      let projects = await projectData.getAllProjects();
      res.render("projects", { projects: projects });
    }
  } catch (err) {
    res.status(404).render("404", { message: "An error occurred." });
  }
});

app.get("/solutions/projects/:id", async (req, res) => {
  try {
    let project = await projectData.getProjectById(req.params.id);
    if (!project) {
      res.status(404).render("404", { message: `No project found with ID: ${req.params.id}` });
    } else {
      res.render("project", { project: project });
    }
  } catch (err) {
    res.status(404).render("404", { message: "An error occurred." });
  }
});

app.get("/solutions/addProject", async (req, res) => {
  try {
    let sectors = await projectData.getAllSectors();
    res.render("addProject", { sectors: sectors });
  } catch (err) {
    res.render("500", { message: `Error loading sectors: ${err}` });
  }
});

app.post("/solutions/addProject", async (req, res) => {
  try {
    await projectData.addProject(req.body);
    res.redirect("/solutions/projects");
  } catch (err) {
    res.render("500", { message: `Error adding project: ${err}` });
  }
});

app.get("/solutions/editProject/:id", async (req, res) => {
  try {
    let sectors = await projectData.getAllSectors();
    let project = await projectData.getProjectById(req.params.id);
    res.render("editProject", { sectors: sectors, project: project });
  } catch (err) {
    res.status(404).render("404", { message: `Error loading project: ${err}` });
  }
});

app.post("/solutions/editProject", async (req, res) => {
  try {
    await projectData.editProject(req.body.id, req.body);
    res.redirect("/solutions/projects");
  } catch (err) {
    res.render("500", { message: `Error editing project: ${err}` });
  }
});

app.get("/solutions/deleteProject/:id", async (req, res) => {
  try {
    await projectData.deleteProject(req.params.id);
    res.redirect("/solutions/projects");
  } catch (err) {
    res.render("500", { message: `Error deleting project: ${err}` });
  }
});

app.use((req, res) => {
  res.status(404).render("404", { message: "I'm sorry, we're unable to find what you're looking for" });
});

projectData.initialize().then(() => {
  app.listen(HTTP_PORT, () => {
    console.log(`Server listening on: ${HTTP_PORT}`);
  });
});