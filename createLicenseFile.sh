-e/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/
for i in $(find . -type f -iname "*js")
do
echo $i
echo -n -e "$(echo '/** Part of APIAddicts. See LICENSE fileor full copyright and licensing details. Supported by Madrid Digital and CloudAPPi **/\n'; cat $i)" > $i
mv $i.bck $i 
done