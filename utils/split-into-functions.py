import os,sys,time,re


FILE=sys.argv[1]
README=sys.argv[2]
OUTDIR=sys.argv[3]

readmelst = []

with open(README, 'r') as fh :
	for line in fh : 
		readmelst.append(line.rstrip('\n'))

print '[%s]' % '\n '.join(map(str, readmelst))

thisfile = readmelst.pop(0)
nextfile = readmelst.pop(0)

if (re.search("Browser.prototype", thisfile)) :
	fname = thisfile.split('Browser.prototype.')[1]
elif (re.search("Genome.prototype", thisfile)) :
	fname = thisfile.split('Genome.prototype.')[1]
elif (re.search("function", thisfile)) : 
	fname = thisfile.split()[1]


filename = OUTDIR + "/" + fname.rstrip('\n') + ".js"

writeHeader = 0
header = "/*---" + filename + "---*/"

with open(FILE, 'r') as ff :
	for row in ff :
		row.rstrip('\n')
		
		if (re.search(nextfile, row)) :
			if (re.search("Browser.prototype", row)) :
				fname = nextfile.split('Browser.prototype.')[1]
				remStr = row[len(nextfile):]
				header = "/**\n * ===BASE===// "+ str(os.path.basename(os.getcwd())) +" // "+fname +".js\n * @param __Browser.prototype__\n * @param \n */\n\n"
			
			elif (re.search("Genome.prototype", row)) :
				fname = nextfile.split('Genome.prototype.')[1]
				remStr = row[len(nextfile):]
				header = "/**\n * ===BASE===// "+ str(os.path.basename(os.getcwd())) +" // "+fname +".js\n * @param __Genome.prototype__\n * @param \n */\n\n"
			
			elif (re.search("function", row)) : 
				fname = nextfile.split()[1]
				remStr = row[len(nextfile):]
				header = "/**\n * ===BASE===// "+ str(os.path.basename(os.getcwd())) +" // "+fname +".js\n * @param \n */\n\n"

			writeHeader = 1
			outfile.close()

			filename = OUTDIR + "/" + fname.rstrip('\n') + ".js"
			if (len(readmelst)) :
				nextfile = readmelst.pop(0)

		with open(filename, 'a') as outfile :
			print "----------- working on .. " + filename
			if (writeHeader) :
				outfile.write(header)
				writeHeader = 0

			outfile.write(row)
			
# Grep command to create README :  ~/WebstormProjects/rb/app/scripts/js/base/a7.baseFunc.js | grep "function" | awk -F'(' '{print $1}'  | awk -F'=' '{print $1}'
				

