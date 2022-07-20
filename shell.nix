{pkgs ? import <nixpkgs> {}}:

(pkgs.buildFHSUserEnv {
  name = "discord-fodido";
  targetPkgs = pkgs: with pkgs; [
    nodejs
    heroku
    glibc
    gcc
    python38
    gnumake
  ];
  
}).env
