FROM python:3.8-bullseye

ENV CI=true
ENV PIP_IGNORE_INSTALLED=0

WORKDIR /app

#update linux packages
RUN apt update

#install R 4.0
RUN apt-get -y install --no-install-recommends --no-install-suggests gnupg2 gnupg1 ca-certificates software-properties-common
RUN apt-get -y install dirmngr gnupg apt-transport-https ca-certificates software-properties-common
RUN apt-key adv --keyserver keyserver.ubuntu.com --recv-keys E298A3A825C0D65DFD57CBB651716619E084DAB9
RUN add-apt-repository 'deb https://cloud.r-project.org/bin/linux/ubuntu focal-cran36/'
RUN apt-get install -y r-base


#install python packages
COPY requirements.txt ./
RUN pip3 install --no-cache-dir -r requirements.txt

#install R and packages
RUN apt-get install -y libgsl-dev
COPY r_packages.txt ./
RUN xargs apt-get install -qq -y <r_packages.txt
RUN R -e "install.packages(c('RcppGSL','RcppZiggurat','Rfast'),dependencies=TRUE,repos='http://cran.rstudio.com/')"
RUN R -e "install.packages(c('mixsqp'),dependencies=TRUE,repos='http://cran.rstudio.com/')"
RUN R -e "install.packages(c('susieR'),dependencies=TRUE,repos='http://cran.rstudio.com/')"
RUN R -e "install.packages(c('Ckmeans.1d.dp'),dependencies=TRUE,repos='http://cran.rstudio.com/')"

#install node and npm
ENV NODE_VERSION=16.13.0
RUN apt install -y curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version

COPY package.json ./

RUN npm install

COPY ./ ./

#remove windows line endings
RUN apt-get install -y dos2unix
RUN dos2unix pipeline_scripts/pipeline.sh
RUN chmod 775 pipeline_scripts/pipeline.sh

RUN npm run build

CMD [ "npm", "run", "start:prod" ]
