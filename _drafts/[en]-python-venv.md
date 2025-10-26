---
layout:   post
title:    "Ambientes Virtuais no Python"
author:   Lucas Miranda
date:     2023-06-26 00:00:00 -0300
category: python
---


Packaging and modularity are great features present in every relevant programming language, as it allows us, developers, to easily reuse recurrent code snippets (a.k.a modules).

In Python we can add packages as dependencies of our project by installing them with some package manager like pip:

```bash
pip install requests==2.30.0
pip install pytest pytest-cov
```

In the example we are installing the library `requests` version 2.30.0 in the first line and in the second line we are installing the libraries `pytest` and `pytest-cov`. As we are not specifying any version for the packages pytest and pytest-cov, we will have the latest versions installed.

That is pretty cool, but a problem arises when working on multiple projects simultaneously or sharing projects with others, or even if we use the machine to study. The management of project-specific packages becomes challenging.

## Downside of global installations (non virtual environments)

Before we get started with virtual environments, let's picture one situation. Let's say you have started in a new project, and you have to install `pandas`, `requests` and `jinja` for it. You will simply run:

```bash
pip install Jinja2 requests pandas
```

After that, you are going to share this project with someone else, and of course, you will use git to version it and send it to your remote repository like github. Now, other people need to contribute with your project, but when they try to run it, all they see is an error message saying "no module named 'pandas'", which makes sense, since you are sharing only your source code in the repository and not your entire setup (python, packages installed, environment etc.)

![Screenshot showing error "no module named 'pandas'"](/assets/ambientes-virtuais-em-python/no-module-named-pandas.webp)

To solve this problem you could simply give instructions to people working in your project to run `pip install Jinja2 requests pandas`. But that does not completely resolve the problem. Some people might already have some different version of requests installed in their machines, which would not raise the same error as before, but it could raise different errors related to incompatibilities between the different versions used - and now you say "it works on my machine!"

### Freezing

So you will need a way to share the exactly same versions you are using in the current project with people to make it work properly. Fortunately, python comes with a solution for that: the subcommand `freeze` from `pip`. With this command you can output all your dependencies (including the depencies of your original dependencies - dependency graph) with their specified versions and then you can use this output to create a text file, which can be used to install the correct dependencies:

```bash
pip freeze > requirements.txt
```

The command above is a common pattern in python to create a `requirements.txt` file with the dependencies you have installed so far (it "freezes" them with current installed versions). Then, when you want to setup the project in a new machine, you can run:

```bash
pip install -r requirements.txt
```

This command will install everything you have in your `requirements.txt` file.

> **Note:** Make sure to keep this file on root of your source code for convenience.

Now we have a short command to install every single dependency and we just have to ensure that `requirements.txt` is up-to-date by running `pip freeze > requirements.txt` every time we include a new dependency to our project, right? Not exactly. We still have a problem.

### Globally installed packages

Remember when we first installed `requests 2.30`, `pytest` and `pytest-cov` at the beggining of this article? Those libraries are not part of the dependencies of the project we have started later, but you will note that your `requirements.txt` still includes them (and all their dependency tree). Take a look:

![Content of the requirements file highlighting requests and pytest dependencies](/assets/ambientes-virtuais-em-python/requirements-file.webp)

This can be a problem, because it will install non-required packages for the project and it might even affect the way our dependencies will be resolved by pip install. Furthermore, imagine the mess we will have when we need to work with different versions of the same package for distinct projects in the same machine...

To overcome this problem, we can use python's virtual environments.

## Python's venv

Virtual environment in python - venv for short - is a resource to isolate your project context (python interpreter, libraries installation etc.) from your global python configuration. In practice, the packages installed under a virtual environment does not conflict with packages installed globally in your machine. It is a best practice to have different venvs for each project you are working on. Next we will see a step-by-step guide to use and understand venv.

### Create venv

Python comes with a builtin module to create virtual environment. It is called `venv`, and you can use it to create a new virtual environment just like that:

```bash
python -m venv venv 
# note: in your system, python command may be under other name 
# like python3 or just py instead of python...
```

In the above command, `python -m venv` is the command to create a new virtual environment and the last `venv` is just the name of your virtual environment. It will be used to create the local folder containing the python interpreter, libraries installed etc. It could be any other name, venv is the most commonly used name though.

> **Note:**
>  Do not worry about the folder venv generated by this command.
>  It will be managed by python and you will never have to touch it.

Your venv is now created, but it is not active yet, so you are still in your regular environment.

### Activate venv

Now that we have a venv for the project, we can activate it to take advantage of its benefits.

```bash
# Linux and MacOS:
source myvenv/bin/activate

# Windows
.\venv\Scripts\activate
```

You will note that "venv" - or whatever name you gave to your venv - appears in green on your command line, indicating that your virtual environment was succesfully activated and now you are running on it.

Do not worry about your shell configuration, it remains mostly unmodified. Your python interpreter changes to the one contained in your venv though.

### Working on venv

First thing to notice is that you do not have access to the packages and modules that you have installed globally. Trying to import pandas you raise `ModuleNotFoundError` for example. It makes sense, we are in a brand new environment right now.

Let's try to re-install the dependencies we need and freeze them.

```bash
pip install Jinja2 requests pandas 
pip freeze > requirements.txt
```

Note that you can play around with `python` and `pip` commands just like we do outside of the virtual environment. The difference is that pip and python source here is the venv instead of your global installation.

Look at the difference between the previous `requirements.txt` (on the left) against the new one generated in the virtual environment (on the right):

![Comparison between the requirements file before and after virtual environment](/assets/ambientes-virtuais-em-python/diff-requirements-venv.webp)

From 22 we went to 13 dependencies. This is a reduction of 9 dependencies. Basically 40% less dependencies than we had before!

> **Note:**
> When you close your terminal or your IDE, your virtual environment will be deactivated. So you have to activate it every time you open it again.

### Deactivate venv

Whenever you need to deactivate your venv to get back to your "global environment", you can simply run the deactivate script.
```bash
deactivate
```

## Further considerations
Perfect, now we can work with virtual environments to have an isolated context for each project we are working on, but there are still some last observations.

### Git

The virtual environment directory can contain a lot of files and it tends to be large in size. Also, the package manager might not work the same way in different machines, so you should include your venv folder in .gitignore file when working with git. This way you keep only the source code in the remote repository, the venv can be reproduced by anyone and the package manager will do the best to install the dependencies in the right way.

### CI/CD pipelines

In CI/CD pipelines usually we already have a fully isolated environment, so there is no need to add commands in your scripts to create and activate the virtual environment before installing the dependencies. You can go straight forward to the installation and execution of your python script in these cases.

### VSCode Users

There is some cool extensions for python in VSCode, but the essential one, in my opinion, is the Python from Microsoft.

![Python extension on VSCode extensions store](/assets/ambientes-virtuais-em-python/vs-code-extension.webp)

This extension brings features like intellisense, debugging and so on.
In order to take advantage of the features of this extension, you have to make sure that the python interpreter currently selected is the one of your venv (assuming that you are working in a venv).

Let's suppose I have added a new dependency to my project (only on venv)

```bash
pip install matplotlib 
pip freeze > requirements.txt
```

Here is what will happen if we are NOT selecting the correct python interpreter:

![VSCode alerting matplotlib was not found](/assets/ambientes-virtuais-em-python/matplotlib-not-found.webp)

Note that we have matplotlib installed in our venv, but we still get a warning from VSCode saying that matplotlib could not be resolved. Look what we get if we try to run it from the VSCode "run button":

![VSCode finishing python script execution with error on run with play button](/assets/ambientes-virtuais-em-python/vs-code-python-script-with-error.webp)

If we try to run from the terminal with `venv` active:

![Execution with success on run in command line with virtual environment active](/assets/ambientes-virtuais-em-python/python-script-with-success-venv.webp)

That means that VSCode is using the wrong interpreter. To fix that is very easy. You just have to hit in the right bottom corner the Python interpreter (marked in red in the illustration) and in the upper panel that will open, select the correct interpreter (you can identify the right one by the path - also marked in red).

![Selecting the correct python interpreter in VSCode config](/assets/ambientes-virtuais-em-python/select-interpreter-vs-code.webp)

After that, the warnings will disappear, your intellisense will work fine and the run button will not result in error anymore:

![VSCode working fine after selecting the correct interpreter](/assets/ambientes-virtuais-em-python/vs-code-correct-interpreter.webp)

It is also interesting to notice that in the bottom right corner will be showing your `venv` interpreter.

---

In conclusion, virtual environments are a powerful tool for managing dependencies and creating isolated project contexts in Python. They help ensure consistent installations and prevent conflicts between different projects.
If you want to go deeper in virtual environments, check also [https://realpython.com/python-virtual-environments-a-primer/](https://realpython.com/python-virtual-environments-a-primer/)
