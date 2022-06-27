FROM continuumio/miniconda3

ENV CI=true
ENV PIP_IGNORE_INSTALLED=0

WORKDIR /app

#update linux packages
RUN apt update

# Create the environment:
COPY polyfun.yml .
SHELL ["/bin/bash", "-c"]
RUN conda env create -f polyfun.yml
RUN conda init bash
#SHELL ["/bin/bash", "-c", "conda activate  pGWAS"]
#RUN conda activate  pGWAS
RUN echo "conda activate pGWAS" >> ~/.bashrc
ENV PATH="$PATH:/opt/conda/envs/pGWAS/bin"
ENV PATH="$PATH:/opt/conda/bin"



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


####
#RUN apt-get install -y r-cran-rcppgsl
 RUN  R -e "install.packages('susieR',dependencies=TRUE, repos='http://cran.rstudio.com/')" 
#RUN /opt/conda/bin/conda activate pGWAS



# 

ENV PATH="/opt/conda/envs/env/bin:$PATH"
ENV PATH="/opt/conda/etc/profile.d:$PATH"

RUN echo "source /opt/conda/etc/profile.d/conda.sh"  >> ~/.bashrc
RUN echo "conda activate pGWAS" >> ~/.bashrc
RUN source activate pGWAS
# Temporarily disable strict mode and activate conda:
#SHELL ["/bin/bash", "-c", "conda activate  pGWAS"]
#CMD [ "npm", "run", "start:prod" ]
CMD ["/bin/bash", "-c", "/app/pipeline_scripts/pipeline.sh"]