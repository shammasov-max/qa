#!/bin/bash
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg && sudo chmod go+r /usr/share/keyrings/githubcli-archive-keyring.gpg && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null && sudo apt update && sudo apt install gh -y
apt install gh -y
apt purge nodejs -y --auto-remove
apt update -y
apt upgrade -y
apt install -y curl wget ncdu nano git
apt install -y build-essential checkinstall libssl-dev
# Add Docker's official GPG key:
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc

# Add the repository to Apt sources:
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update

sudo apt-get install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

curl -sL https://deb.nodesource.com/setup_20.x -o /tmp/nodesource_setup.sh
bash /tmp/nodesource_setup.sh
apt update
apt upgrade
apt install -y nodejs libpq-dev g++ make
npm i -g npm@latest
npm i -g yarn@latest typescript@latest ts-node@latest

sudo apt install -y libjpeg-dev libpng-dev libtiff-dev libgif-dev
cd ~
wget -o libwbp-1.3.2.tar.gz https://storage.googleapis.com/downloads.webmproject.org/releases/webp/libwebp-1.3.2.tar.gz
tar xvzf libwebp-1.3.2.tar.gz
cd libwebp-1.3.2/ && ./configure && make && sudo make install
echo "export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/usr/local/lib" >> ~/.bashrc
sudo apt -y install libglu1
apt install -y libxi6 libgconf-2-4
apt install -y libpq-dev python-dev
apt update -y && apt upgrade -y