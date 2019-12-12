import inquirer from "inquirer"

export const askGithubCredentials = () => {
  const questions = [
    {
      name: "username",
      type: "input",
      message: "Enter your GitHub username or e-mail address:",
      validate: value => {
        if (value.length) {
          return true
        } else {
          return "Please enter your username or e-mail address."
        }
      }
    },
    {
      name: "password",
      type: "password",
      message: "Enter your password:",
      validate: value => {
        if (value.length) {
          return true
        } else {
          return "Please enter your password."
        }
      }
    }
  ]
  return inquirer.prompt(questions)
}

export const search = () => {
  const questions = [
    {
      name: "searchString",
      type: "input",
      message: "Search:",
      validate: value => {
        if (value.length) {
          return true
        } else {
          return "Please enter a search"
        }
      }
    }
  ]
  return inquirer.prompt(questions)
}
