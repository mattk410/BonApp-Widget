#!/usr/bin/env python

from urllib2 import urlopen
import string, os, time, json, re, unicodedata, HTMLParser

# Bon appetit cafe hours api url
url 	   = "http://legacy.cafebonappetit.com/api/2/cafes?cafe="
# How many cafeterias you want to parse (in order)
totalCafes = 1159
# What our file should be named
fileName   = "data.json"


# Our constructed JSON data
responseData = []
# Parser to clean up the string names
h = HTMLParser.HTMLParser()
# Time when we started the script
start = time.time()

def appendData( cafeId, cafeName, cafeLoc ):
	responseData.append( {'id':cafeId,'label':cafeName, 'desc':cafeLoc} )


def cleanUpTitle( stringToClean ):
	# Remove beginning and ending whitespace
	string = stringToClean.strip()
	# Replace html
	cleanString = h.unescape( string )
	# Replace unicode
	cleanString2 = unicodedata.normalize( 'NFKD', cleanString ).encode( 'ascii','ignore' )
	# Capitalize string
	return cleanString2[0].capitalize() + cleanString2[1:]


def cleanUpLocation( stringToClean ):
	# Remove beginning and ending whitespace
	string = stringToClean.strip()
	# Replace html
	cleanString = h.unescape( string )
	# Replace unicode
	cleanString2 = unicodedata.normalize( 'NFKD', cleanString ).encode( 'ascii','ignore' )

	# Handle city/state (length will be longer than 2 chars)
	if len( cleanString2 ) > 2:
		# Capitalize each first letter
		string2 = cleanString2.title()
	else:
		string2 = cleanString2[0].capitalize() + cleanString2[1:]

	return string2


# Finds the cafeteria id and name
def getBonAppMenuData( url, id ):
	# Construct the full url
	url2 = ''.join( [url, str(id)] )

   	# Receive the content of url and convert it to a string
	response  = urlopen( url2 )
	data 	  = str( response.read() )

	try:
		# Grab cafe Id from JSON
		cafeId    = json.loads( data )["cafes"].keys()[0]

		# Grab cafe name from JSON
		cafeName  = json.loads( data )["cafes"][cafeId]["name"]


		# We want to display titles at least. We can do without location.
		try:
			# Grab cafe city from JSON
			cafeCity  = json.loads( data )["cafes"][cafeId]["city"]
		except:
			cafeCity  = ""
		try:
			# Grab cafe state from JSON
			cafeState = json.loads( data )["cafes"][cafeId]["state"]
		except:
			cafeState = ""


		# Formatting city and state strings
		# Both empty
		if cafeCity == "" and cafeState == "":
			cafeLoc	= "No location listed"
		# Only city
		elif cafeCity != "" and cafeState == "":
			cafeLoc = cleanUpLocation( cafeCity )
		# Only State
		elif cafeCity == "" and cafeState != "":
			cafeLoc = cleanUpLocation( cafeState )
		# City and State
		else:
			cafeLoc = cleanUpLocation( cafeCity ) + ", " + cleanUpLocation( cafeState )


		# Clean up the cafe name
		cafeName  = cleanUpTitle( cafeName )

		# Construct the full return string
		appendData( cafeId, cafeName, cafeLoc )
	except:
		pass

# Round numbers to a decimal point
def num2str( num, precision ):
	return "%0.*f" % ( precision, num )

# Get the outfile's size
def calculateFileSize():
	fileSize = os.path.getsize( fileName )
	fileSize = str( fileSize )
	return fileSize


# Loop through the "known" amount of cafes
for num in range( 0, totalCafes ):
	# Start yer engines, Jed
	getBonAppMenuData( url, num )

# Write our output to a file
with open( fileName, 'w' ) as outfile:
    # Output the data into a file
    json.dump( responseData, outfile )
    # Play a sound to alert that we have finished
    os.system('afplay /System/Library/Sounds/Glass.aiff')
    # Save the runtime
    endTime = time.time() - start;

print 'File: ' + fileName
print 'Size: ' + calculateFileSize() + ' bytes'
print 'This took ' + num2str( endTime, 2 ) + ' seconds\n'
