---
layout: post
title:  "Understanding pip - The package installer for python"
author: Lucas Miranda
date:   2023-07-31 00:00:00 -0300
category: python
---

Libraries are essential components in programming as they allow developers to reuse pre-written code, saving time and effort. They provide high-level abstractions, promoting faster development and shielding users from complex implementation details, enabling developers to focus on core application logic. To facilitate the distribution and share of such libraries, we have online repositories like github (general source code), npm (for javascript libraries) and PyPI (for python packages). In PyPI we can find libraries like requests to handle http calls, pandas for data analysis, pyspark to process big data and so on.

With libraries we do not have to reinvent the wheel and it is freely distributed over the internet! But now comes the question: how can we use these libraries?

## Using Python libraries

When we are new in the programming, it is a common sense to think that it is pretty straight forward to use a library: just copy the source code to your folder and start using it in your code. That is not wrong. But it would be a tedious task to search in [PyPI](https://pypi.org/) the library we want, download the source code, identify the folders we need and paste them into our project's folder… Remember that you would be doing this several times in the same project as we usually work with a set of dependencies. You would also be responsible to manually update the libraries' code every time the library owner updates it in PyPI to fix a bug or add a new feature.

### It is not just copy and paste

Copy and paste source code into our workspace would raise other issues in addition to the manual effort. One of them is that we would duplicate code in a dumb bad-managed way, because the library that we copied the source code would be replicated in several projects all over the internet.

Another problem is the dependency management itself. Imagine the following scenario: you want to create a new library, but you want to use features from another libraries (dependencies) in PyPI. Now someone will consume your library and this developer will also use another library, that is exactly the same one that is in your dependencies, but in a newer version. If it was just copy and paste, how would this developer handle this situation? Even if the two versions of the library is copied (one for your dependency and the newer for the developer's project), how should Python know which one is called by import?

This is where pip, the package installer for Python, comes to the rescue.

## Package installer for Python

At this point you understand why we need a **package manager**. For python we have `pip` - a command-line **Package Installer for Python**, as the "official" package manager (there are other options to `pip` though). It simplifies the process of downloading and installing packages from PyPI and other repositories - ok, in the end is like a fancy-smart-automated copy and paste. Libraries installed with `pip` or other package managers will be available to import their packages/subpackages/modules.

Take a look in some of the features:

- **Easy Package Installation:** install Python packages with pip's CLI
- **Dependency Resolution:** It automatically resolves and installs dependencies required by a package, ensuring a smooth installation process.
- **Package Uninstallation:** With pip, you can uninstall packages and their associated dependencies cleanly, reducing clutter in your development environment.
- **Version Management:** pip handles package versions, allowing you to install specific versions or the latest compatible ones.

### How to pip

Usually pip comes pre-installed along with Python's installation. However, if you don't have pip installed for some reason, you can get it by downloading the `get-pip.py` script and running it with the Python interpreter ([check here for further instructions on installation](https://pip.pypa.io/en/stable/installation/)).

Now let's see how to perform some common package management operations using pip.

#### Installing Packages

Use the `pip install` command followed by the package name to install a package.
```bash
# install package pandas from PyPI
pip install pandas

# install multiple pacakges at once - pytest, sphinx and mypy
pip install pytest sphinx mypy

# install package with optionals
pip install "fastapi[all]"

# install specific version of requests package
install requests==2.26.0

# install from github repository (package must be installable)
pip install 'git+https://github.com/pydantic/pydantic'
```

#### Upgrading Packages

To upgrade an already installed package to the latest version, use `pip install --upgrade package_name`

```bash
pip install --upgrade requests
```

When we upgrade a package, the old version is removed from our system and the new one takes place. We can not have multiple versions of the same library installed in the same environment.

#### Uninstalling Packages

Remove a package and its dependencies with `pip uninstall package_name`

```bash
pip uninstall pandas
```

#### Listing your packages

With the `pip list` command, you can list all the packages you have installed in your machine.
```bash
pip list
```

It is interesting to notice that we probably have a large list of packages even if you have installed only a single library, because `pip` manages to install all the required dependencies of the libraries to ensure everything is going to be correctly integrated.

This is how a brand new environment looks like when running `pip list`:

```
Package Version
 - - - - - - - - -
pip 22.0.2
setuptools 59.6.0
```

This is what it becomes after installing a single package pip install pytest:

```
Package Version 
 - - - - - - - - - - - 
exceptiongroup 1.1.2
iniconfig 2.0.0
packaging 23.1
pip 22.0.2
pluggy 1.2.0
pytest 7.4.0
setuptools 59.6.0
tomli 2.0.1
```

This package, `pytest`, is one example with few dependencies, and it still brings 5 new packages.

### Managing dependencies with requirement files

When you install libraries using `pip`, the library's code itself is placed next to your python interpreter in the file system. Consequently, we can keep the dependencies apart from our source code. If we share our source code with colleagues, we will get `ImportError`, right? Also, how can we prevent conflicts between different versions of the same library when working in distinct projects? To address such issues, we can use requirement files and virtual environments. If you want to go deeper in the problem, I have written a whole article about [Python Virtual Environments here](https://medium.com/@pdx.lucasm/python-virtual-environments-18ee3e8d2c3f).

In short, virtual environments help us to isolate our environment at project level. Thus, for each different project we can have different set of dependencies with different versions.

In the virtual environment we can install our dependencies and we can use requirement files to easily install everything we need. Requirement files are text files where we have the dependencies of the project declared with their respective versions and sources. We can generate a requirement file by running `pip freeze` command and writting its output in a text file.

```bash
pip freeze > requirements.txt
```

Now, whenever we share the project or we have to setup it again, we can easily install the dependencies from the requirements file with `pip install -r requirements_file`

```bash
pip install -r requirements.txt
```

Requirements files should be included in your git repository if you are versioning your project. On the other hand, your virtual environment containing your dependencies installations should not be in the remote repository, so make sure to include it in your .`gitignore` file.

## Conclusion

Understanding the basics of package management is essential for a developer as it is such a common component of programming language's ecosystems in general. From installing basic libraries to managing complex project dependencies, a package manager simplifies the process and ensures a smooth development experience.

## Further reading

- [Python Virtual Environments](https://medium.com/@pdx.lucasm/python-virtual-environments-18ee3e8d2c3f)
- [What is installing Python modules or packages? - Stack Overflow](https://stackoverflow.com/questions/32551690/what-is-installing-python-modules-or-packages)
- [Using Python's pip to Manage Your Projects' Dependencies - Real Python](https://realpython.com/what-is-pip/)
- [Python Package Managers Explained - Inedo Blog](https://blog.inedo.com/python/managing-python-packages#:~:text=Pip%3A%20The%20Standard%20Package%20Manager,being%20accessible%20by%20all%20projects.)
- [Installing Packages - Python Packaging User Guide](https://packaging.python.org/en/latest/tutorials/installing-packages/)