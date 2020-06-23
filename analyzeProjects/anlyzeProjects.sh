#!bin/bash
organization="juancarruthers-github"; #unne-sonar-corpus
token="162e4ecf2196b747aaaf029273336ba458e3eec7"; #New Token "Analysis"
cd projects;
for project in $(ls)
do
    cd ${project};
    ../../sonar-scanner/bin/sonar-scanner -Dsonar.organization=${organization} -Dsonar.host.url=https://sonarcloud.io -Dsonar.login=${token} 2>&1 | tee ../../tmp;
    search=$(grep 'EXECUTION SUCCESS' ../../tmp);
    if test -z "$search"
    then    
        date "+%d/%m/%y    %H:%M:%S" >> ../../results.txt;
        cat ../../tmp >> ../../results.txt;
        lineBreak="\n";
        echo $lineBreak >> ../../results.txt; 
    fi 
    rm  ../../tmp;
    cd ..;
done
