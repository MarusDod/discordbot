{pkgs ? import <nixpkgs> {}}:

with pkgs; mkShell {
  name = "discord-fodido";
  nativeBuildInputs = [
    stdenv.cc
    python38
    gnumake
    pkg-config
    libstdcxx5
  ];
  buildInputs = [
    nodejs-18_x
  ];
  
}
