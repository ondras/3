out/%-tl.3mf: geb.scad
	openscad -o '$@' -D 'input="$*"' -D 'first="tl"' $^

out/%-tr.3mf: geb.scad
	openscad -o '$@' -D 'input="$*"' -D 'first="tr"' $^

clean:
	rm out/*
