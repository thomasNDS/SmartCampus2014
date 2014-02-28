import httplib
from BeautifulSoup import BeautifulSoup

conn = httplib.HTTPConnection("www.crous-grenoble.fr") # never http:// and not  end /
conn.request("GET", "/rss-menu-3.htm")										# launch a Get request
response = conn.getresponse()												# store the answer
print response.status, response.reason							# just print the debug, if success
data = response.read()																	# get the html as a string '<html >...</html>'
tree = BeautifulSoup(data)															# string to a tree structure 

print tree.channel.title.string
print  "============\n"

items = tree.findAll("item")
for item in items:
    print item.title.string + "\n-----------\n" + item.description.string + "\n"



