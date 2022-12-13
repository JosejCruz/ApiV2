cd %USERPROFILE%
SET Carpeta = "Estudios\"
IF NOT EXIST %Carpeta%(
    mkdir Estudios
    cd Estudios
    mkdir Templates
    mkdir Tmp
    mkdir Final
    cd ..
    copy ApiV2/src/templates/docs/* Estudios/Templates/
)