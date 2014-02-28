import httplib

conn = httplib.HTTPConnection("www.google.com")  # never http:// and not  end /
conn.request("GET", "/index.html")										# launch a Get request
response = conn.getresponse()												# store the answer
print response.status, response.reason							# just print the debug, if success
data = response.read()																	# get the html as a string '<html >...</html>'
print data

