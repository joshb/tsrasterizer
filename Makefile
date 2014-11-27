TSC=tsc
TSDIR=TypeScript
JSFILE=JavaScript/tsrasterizer.js

tsrasterizer:
	$(TSC) --out $(JSFILE) $(TSDIR)/*.ts

clean:
	rm -f $(JSFILE)
