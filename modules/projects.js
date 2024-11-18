require("dotenv").config();
const Sequelize = require("sequelize");

const sequelize = new Sequelize(process.env.PGDATABASE, process.env.PGUSER, process.env.PGPASSWORD, {
  host: process.env.PGHOST,
  dialect: "postgres",
  port: 5432,
  dialectOptions: {
    ssl: { rejectUnauthorized: false },
  },
});

const Sector = sequelize.define(
  "Sector",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sector_name: Sequelize.STRING,
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

const Project = sequelize.define(
  "Project",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: Sequelize.STRING,
    feature_img_url: Sequelize.STRING,
    summary_short: Sequelize.TEXT,
    intro_short: Sequelize.TEXT,
    impact: Sequelize.TEXT,
    original_source_url: Sequelize.STRING,
    sector_id: Sequelize.INTEGER,
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

Project.belongsTo(Sector, { foreignKey: "sector_id" });

function initialize() {
  return sequelize.sync();
}

function getAllProjects() {
  return Project.findAll({ include: [Sector] });
}

function getProjectById(projectId) {
  return Project.findAll({
    where: { id: projectId },
    include: [Sector],
  }).then((projects) => (projects.length > 0 ? projects[0] : Promise.reject("Unable to find requested project")));
}

function getProjectsBySector(sector) {
  return Project.findAll({
    include: [Sector],
    where: {
      "$Sector.sector_name$": {
        [Sequelize.Op.iLike]: `%${sector}%`,
      },
    },
  });
}

function addProject(projectData) {
  return Project.create(projectData);
}

function editProject(id, projectData) {
  return Project.update(projectData, { where: { id } });
}

function deleteProject(id) {
  return Project.destroy({
    where: { id },
  });
}

function getAllSectors() {
  return Sector.findAll();
}

module.exports = {
  initialize,
  getAllProjects,
  getProjectById,
  getProjectsBySector,
  addProject,
  editProject,
  deleteProject,
  getAllSectors,
};
