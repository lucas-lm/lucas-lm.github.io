---
layout: post
title:  "Poetry: a flawless package manager for Python projects"
author: Lucas Miranda
date:   2023-08-23 00:00:00 -0300
category: python
---


If you have worked on Python projects before using pip and venv to manage your dependencies, you are already familiar with the steps to keep everything in a consistent state. I have written about that before in [Python Virtual Environments](https://medium.com/@pdx.lucasm/python-virtual-environments-18ee3e8d2c3f) and [Understanding pip](https://medium.com/@pdx.lucasm/understanding-pip-the-package-installer-for-python-d3401de7072a), and we have to agree that is very boring to manage `requirement.txt` files, virtual environments and group dependencies (like development dependencies, CI/CD dependencies etc.). It is so boring that Python developers decided to create a new dependency manager to handle these chores. I am talking about [Poetry](https://python-poetry.org/), a very popular tool among Python community to manage dependencies, packaging and publishing code.

## Poetry vs pip + venv

To understand how Poetry makes our lives easier, let's compare some common operations in the development cycle with Poetry against the "standard" approach with `pip` and `venv`.

### Starting a project

With Poetry we can start a new project by running a simple command through poetry CLI:
```bash
# with poetry
poetry new my-project
```

Without Poetry we would have to create a new folder, create a virtual environment inside this folder and activate the virtual environment:
```bash
# without poetry
mkdir my-project
cd 'my-project'
python3 -m venv venv
source venv/bin/activate
```

Besides being easier to start the project with Poetry, it also creates a basic project structure:
```
my-project
├── pyproject.toml
├── README.md
├── my_project
│   └── __init__.py
└── tests
    └── __init__.py
```

Note that no "venv" folder is generated in the Poetry's project folder. Poetry actually manages virtual environments in another place outside the project's folder, so you don't have to worry about it. In other words: it exists, you just don't see it.

| Criteria              | Poetry      | pip + env    |
|-----------------------|-------------|--------------|
| Verbosity             | 1 command   | 4 commands   |
| Virtual Environment   | Yes         | Yes          |
| Initial Structure     | Basic       | None         | 


### Installing and removing dependencies

Again with a simple command in Poetry CLI:
```bash
# with poetry
poetry add requests
```

Poetry will install the library in the project's virtual environment and also update `project.toml` and `.lock` files to ensure the dependencies consistency.

Without Poetry we have to install the library and also update the `requirements.txt` file (assuming we are already with virtual environment active).

```bash
# without poetry
pip install requests
pip freeze > requirements.txt
```

Same applies for uninstalling packages

```bash
# with poetry
poetry remove requests

# without poetry
pip uninstall requests
pip freeze > requirements.txt
```

Poetry scores again in terms of verbosity: 1 command against 2 commands in pip + venv. It is also good to know that we can rely on Poetry to manage the dependencies instead of having to explicitly act to update a lock file.

### Setup the project in a new machine

In order to start a fresh setup of the project in your machine, usually you start by cloning the git repository from some remote server like GitHub, then open the project folder in your IDE. This is a common procedure for most of us, even for non-python projects. In my case, using VSCode as IDE:

```bash
# clone the project from remote
git clone https://github.com/<some-user-or-org>/<my-repository>.git
code "my-repository"
```

This step is required whether you are using Poetry or not. Next you have to install dependencies. With Poetry you can choose the groups of dependencies you want to install. Meanwhile, without poetry is not so straight forward to install dependency groups. In practice, we install dev dependencies in our setup:

```bash
# with poetry
poetry install

# without poetry
pip install requirements_dev.txt
# you often will install your root package as well in editable mode
pip install -e .
```

Poetry will install project dependencies, development dependencies and the project itself in editable mode by default. To emulate this behavior without poetry, we have to manage a requirements_dev.txt file apart and also take an additional step to install the project itself.

To add dev dependencies using poetry is as easy as including a new dependency:

```bash
poetry add pytest --group dev
```

### Running commands in virtual environment

At this point I think you are already convinced that Poetry is a great tool, but let's see one more common operation: running scripts and commands within virtual environment.

To run any script under the Poetry's managed virtual environment, you can use the command line:

```bash
poetry run pytest tests/
```

This command will run anything you pass after poetry run in the virtual environment without having to activate it.

The equivalent way to run this without poetry is to run pytest after activate the virtual environment:

```bash
source venv/bin/activate
pytest tests/
```

Despite the possibility to activate Poetry's managed virtual environment manually, Poetry also provide a command to easily enter in "venv mode" within a sub-shell:

```bash
poetry shell
# to deactivate, just enter 'exit' command
```

## Other features

There is a lot of subcommands and options in the presented commands here that makes Poetry a complete tool for every Python developer. If you have some specific requirement for your project and you are not sure if Poetry can support it, take a quick search on documentation and you will probably find what you want.

### Setting up Poetry for an existing project
Now you became interested in Poetry and want to try it in your current project? You can easily switch to poetry. If you already have a project and want to start using Poetry, you can simply run `poetry init` in the project's root directory.

### Building a package
If you are working on a library or for some reason you have to generate a build for your package, Poetry can also help on that. Generating Python installable package with Poetry is as easy as run `poetry build`.

### Publishing your package in PyPI or other Indexes
Another advantage on Poetry is the `poetry publish` command that allows the distribution of the package over some Index (PyPI by default). However, you must setup your credentials and index config before this command.

### Driven by project.toml
This config file is the main configuration file for Poetry. Most cases will have this as the only config file for Poetry (and sometimes for the whole project), so it is very important to keep it in your Version Control System (your git repository). There you will find metadata for your project like name, version, description etc. Also, this file stores the dependencies and is used by several libraries (like pytest, tox, precommit etc.) to store config information.

### CI/CD pipelines
Capabilities like management of dependency groups, virtual environments, custom scripts and project metadata makes Poetry a nice tool to integrate with CI/CD pipelines. Moreover, the format of CLI fits very well for CI/CD development.

### Requirements file generation
If you are using Poetry and you still have to keep a `requirements.txt` file, you can do it with a command line:

```bash
poetry export -f requirements.txt --output requirements.txt
```

There are a couple of parameters that you can use to customize this export command, like including or excluding groups of dependencies in the requirements file for example. It may be useful for CI/CD or some framework that relies on `requirements.txt` files.

### Environment variables in .env files
This is the Poetry's missing piece. Poetry doesn't support `.env` - a.k.a dotenv - to load environment variables automatically from a text file on scripts startup. If you need environment variables though, you can declare them before running your scripts/commands/application.

### Plugins
Poetry allow us to create plugins to extend its features.

In the case of `.env` files, we have the poetry-dotenv-plugin as part of the Poetry ecosystem. This plugin handles `.env` files, loading the environment variables before scripts execution in the virtual environment.

<!-- ## Conclusion

Poetry has a extensive set of features to overcome pip and venv challenges in the development cycle. I always use poetry in my projects and it helps me a lot, specially when I am working on libraries development.

If you are a Python developer and haven't tried Poetry yet, you certainly should give it a shot. -->

---


## Further read

* [Poetry](https://python-poetry.org/)
* [Dependency Management With Python Poetry - Real Python](https://realpython.com/dependency-management-python-poetry/)
* [Python Poetry: Package and venv Management Made Easy](https://python.land/virtual-environments/python-poetry)
* [How to Create and Use Virtual Environments in Python With Poetry - YouTube](https://www.youtube.com/watch?v=0f3moPe_bhk&t=257s)