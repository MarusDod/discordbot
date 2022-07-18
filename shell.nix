{pkgs ? import <nixpkgs> {}}:

(pkgs.buildFHSUserEnv {
  name = "discord-fodido";
  targetPkgs = pkgs: with pkgs; [
    nodejs
    heroku
    glibc
    python38
    gnumake
  ];
  
}).env
