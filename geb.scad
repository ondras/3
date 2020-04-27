use <Gotham Black Regular.ttf>
// $fn = 50;
input = "BGE";
first = "tl";

module letter(ch) {
    linear_extrude(20, center=true)
        text(ch, valign="center", halign="center",
    font="gotham black");
}

module rotated(type) {
    if (type == "l") {
        rotate(a = 90, v = [1, 0, 0])
            children();
    } else if (type == "r") {
        rotate(a = 90, v = [1, 0, 0])
        rotate(a = 90, v = [0, 1, 0])
            children();
    } else if (type == "tl") {
        rotate(a = 90, v = [0, 0, 0])
            children();
    } else if (type == "tr") {
        rotate(a = 90, v = [0, 0, 1])
            children();
    }
}

module str(str, first=first) {
    intersection() {
        rotated(first)
            letter(str[0]);
        rotated("l")
            letter(str[1]);
        rotated("r")
            letter(str[2]);
    }
}

str(input, first);

