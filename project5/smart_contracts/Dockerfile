# Use an official Ubuntu Xenial as a parent image
FROM ubuntu:latest

# Install Node.js 8 and npm 5
RUN apt-get update
RUN apt-get -qq update
RUN apt-get install -y build-essential
RUN apt-get install -y curl
RUN apt-get install -y git
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash
RUN apt-get install -y nodejs

# Set the working directory to /app
WORKDIR /home

# Copy the current directory contents into the container
ADD . /home

# Install any needed packages specified in requirements.txt
RUN npm install -g ganache-cli truffle
RUN npm install

# Make port 8080 available outside this container
EXPOSE 8080
EXPOSE 8545