---
layout: post
title:  "Poetry: um gerenciador de pacotes completo para projetos Python"
author: Lucas Miranda
date:   2023-08-23 00:00:00 -0300
category: python
---

Se você já trabalhou em projetos Python usando `pip` e `venv` para gerenciar suas dependências, já está familiarizado com os passos necessários para manter tudo em um estado consistente. Eu já escrevi sobre isso antes em [Ambientes Virtuais em Python](/python/2023/06/26/venv.html) e [Entendendo o pip](/python/2023/07/31/pip.html), e precisamos concordar que é bem chato gerenciar arquivos `requirements.txt`, ambientes virtuais e grupos de dependências (como dependências de desenvolvimento, de CI/CD etc.).  
É tão chato que os desenvolvedores Python decidiram criar um novo gerenciador de dependências para cuidar dessas tarefas. Estou falando do [Poetry](https://python-poetry.org/), uma ferramenta muito popular na comunidade Python para gerenciar dependências, empacotamento e publicação de pacotes.

## Poetry vs pip + venv

Para entender como o Poetry facilita nossas vidas, vamos comparar algumas operações comuns do ciclo de desenvolvimento usando o Poetry em contraste com a abordagem "padrão" com `pip` e `venv`.

### Iniciando um projeto

Com o Poetry, podemos iniciar um novo projeto executando um simples comando via CLI:

```bash
# com poetry
poetry new my-project
```

Sem o Poetry, teríamos que criar uma nova pasta, criar um ambiente virtual dentro dela e ativar esse ambiente:

```bash
# sem poetry
mkdir my-project
cd 'my-project'
python3 -m venv venv
source venv/bin/activate
```

Além de ser mais fácil iniciar o projeto com o Poetry, ele também cria uma estrutura básica:

```
my-project
├── pyproject.toml
├── README.md
├── my_project
│   └── __init__.py
└── tests
    └── __init__.py
```

Note que nenhuma pasta "venv" é gerada dentro da pasta do projeto. O Poetry gerencia ambientes virtuais em outro local fora da pasta do projeto, então você não precisa se preocupar com isso. Em outras palavras: ele existe, você só não vê ele.

| Critério          | Poetry    | pip + env  |
| ----------------- | --------- | ---------- |
| Verbosidade       | 1 comando | 4 comandos |
| Ambiente Virtual  | Sim       | Sim        |
| Estrutura Inicial | Básica    | Nenhuma    |

### Instalando e removendo dependências

Novamente, com um simples comando CLI do Poetry:

```bash
# com poetry
poetry add requests
```

O Poetry instalará a biblioteca no ambiente virtual do projeto e também atualizará os arquivos `pyproject.toml` e `.lock` para garantir a consistência das dependências.

Sem o Poetry, precisamos instalar a biblioteca e também atualizar manualmente o `requirements.txt` (assumindo que o ambiente virtual já está ativo):

```bash
# sem poetry
pip install requests
pip freeze > requirements.txt
```

O mesmo vale para desinstalar pacotes:

```bash
# com poetry
poetry remove requests

# sem poetry
pip uninstall requests
pip freeze > requirements.txt
```

Mais uma vez, o Poetry ganha em termos de verbosidade: 1 comando contra 2 comandos no pip + venv.
Também é bom saber que podemos confiar no Poetry para gerenciar as dependências sem precisar atualizar manualmente um arquivo de lock.

### Configurando o projeto em uma nova máquina

Para começar uma configuração nova do projeto, normalmente clonamos o repositório do GitHub (ou outro servidor remoto) e abrimos a pasta do projeto na IDE. Esse é um procedimento comum para a maioria de nós, mesmo fora do mundo Python. No meu caso, usando o VSCode:

```bash
# clonar o projeto do repositório remoto
git clone https://github.com/<algum-usuario-ou-org>/<meu-repositorio>.git
code "meu-repositorio"
```

Essa etapa é necessária com ou sem o Poetry.
O próximo passo é instalar as dependências. Com o Poetry, você pode escolher quais grupos de dependências instalar. Sem ele, isso não é tão simples — na prática, instalamos as dependências de desenvolvimento no setup:

```bash
# com poetry
poetry install

# sem poetry
pip install requirements_dev.txt
# frequentemente também instalamos o pacote raiz em modo editável
pip install -e .
```

O Poetry instalará as dependências do projeto, as de desenvolvimento e o próprio projeto em modo editável por padrão.
Para reproduzir esse comportamento sem o Poetry, é necessário manter um `requirements_dev.txt` separado e ainda executar um comando adicional para instalar o pacote.

Adicionar dependências de desenvolvimento com o Poetry é igualmente simples:

```bash
poetry add pytest --group dev
```

### Executando comandos no ambiente virtual

A essa altura, você provavelmente já está convencido de que o Poetry é uma ótima ferramenta, mas vejamos mais uma operação comum: executar scripts e comandos dentro do ambiente virtual.

Para executar qualquer script dentro do ambiente gerenciado pelo Poetry, basta usar:

```bash
poetry run pytest tests/
```

Esse comando executará qualquer coisa que você passar após `poetry run` dentro do ambiente virtual, sem precisar ativá-lo manualmente.

A forma equivalente sem o Poetry seria:

```bash
source venv/bin/activate
pytest tests/
```

Apesar de ser possível ativar o ambiente virtual gerenciado pelo Poetry manualmente, ele também oferece um comando para entrar facilmente no "modo venv" dentro de um subshell:

```bash
poetry shell
# para sair, basta enviar o comando 'exit'
```

## Outros recursos

Existem muitos subcomandos e flags que fazem do Poetry uma ferramenta completa para qualquer desenvolvedor Python.
Se você tiver algum requisito específico para o seu projeto e não souber se o Poetry dá suporte, procure na documentação — provavelmente encontrará o que precisa.

### Configurando o Poetry em um projeto existente

Agora que você se interessou pelo Poetry e quer testá-lo no seu projeto atual, pode fazer isso facilmente.
Se você já tem um projeto e quer começar a usar o Poetry, basta executar `poetry init` na raiz do projeto.

### Gerando um pacote

Se você está trabalhando em uma biblioteca ou precisa gerar um build do seu pacote, o Poetry também ajuda nisso.
Gerar um pacote instalável em Python com o Poetry é tão simples quanto executar:

```bash
poetry build
```

### Publicando seu pacote no PyPI ou outros índices

Outra vantagem do Poetry é o comando `poetry publish`, que permite publicar o pacote em um index (por padrão, o PyPI).
Entretanto, é necessário configurar suas credenciais e o index antes de usar esse comando.

### Baseado no pyproject.toml

Esse arquivo é a principal fonte de configuração do Poetry.
Na maioria dos casos, será o único arquivo de configuração do Poetry (e às vezes de todo o projeto), então é muito importante mantê-lo no controle de versão (seu repositório git).
Nele você encontrará metadados do projeto como nome, versão, descrição etc.
Além disso, esse arquivo armazena as dependências e é usado por diversas bibliotecas (como pytest, tox, pre-commit etc.) para guardar configurações.

### Pipelines de CI/CD

Funcionalidades como gerenciamento de grupos de dependências, ambientes virtuais, scripts customizados e metadados do projeto fazem do Poetry uma excelente ferramenta para integração com pipelines de CI/CD.
Além disso, o formato do CLI se encaixa muito bem nesse tipo de uso.

### Geração de arquivo requirements.txt

Se você está usando o Poetry, mas ainda precisa manter um arquivo `requirements.txt`, é possível gerá-lo facilmente com:

```bash
poetry export -f requirements.txt --output requirements.txt
```

Existem vários parâmetros adicionais para personalizar o comando de exportação, como incluir ou excluir grupos de dependências.
Isso pode ser útil para CI/CD ou frameworks que ainda dependem do `requirements.txt`.

### Variáveis de ambiente em arquivos .env

Essa é uma peça que falta no Poetry. Ele não oferece suporte nativo a `.env` (dotenv) para carregar variáveis de ambiente automaticamente na inicialização dos scripts.
Se você precisar de variáveis de ambiente, deve declará-las manualmente antes de executar seus scripts ou comandos.

### Plugins

O Poetry permite criar plugins para estender suas funcionalidades.

No caso dos arquivos `.env`, existe o plugin **poetry-dotenv-plugin**, parte do ecossistema do Poetry.
Esse plugin lida com arquivos `.env`, carregando as variáveis de ambiente antes da execução dos scripts no ambiente virtual.

---

## Leitura complementar

* [Poetry](https://python-poetry.org/)
* [Dependency Management With Python Poetry - Real Python](https://realpython.com/dependency-management-python-poetry/)
* [Python Poetry: Package and venv Management Made Easy](https://python.land/virtual-environments/python-poetry)
* [How to Create and Use Virtual Environments in Python With Poetry - YouTube](https://www.youtube.com/watch?v=0f3moPe_bhk&t=257s)
