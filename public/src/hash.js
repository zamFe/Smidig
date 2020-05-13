//http://geraintluff.github.io/sha256/
function sha256(r) {
    function o(r, o) { return r >>> o | r << 32 - o }
    for (var f, a, t = Math.pow, h = t(2, 32), n = "length", c = "", e = [], i = 8 * r[n], s = sha256.h = sha256.h || [], u = sha256.k = sha256.k || [], v = u[n], l = {}, g = 2; v < 64; g++)
        if (!l[g]) {
            for (f = 0; f < 313; f += g) l[f] = g;
            s[v] = t(g, .5) * h | 0, u[v++] = t(g, 1 / 3) * h | 0
        }
    for (r += ""; r[n] % 64 - 56;) r += "\0";
    for (f = 0; f < r[n]; f++) {
        if ((a = r.charCodeAt(f)) >> 8) return;
        e[f >> 2] |= a << (3 - f) % 4 * 8
    }
    for (e[e[n]] = i / h | 0, e[e[n]] = i, a = 0; a < e[n];) {
        var k = e.slice(a, a += 16),
            d = s;
        for (s = s.slice(0, 8), f = 0; f < 64; f++) {
            var p = k[f - 15],
                w = k[f - 2],
                A = s[0],
                C = s[4],
                M = s[7] + (o(C, 6) ^ o(C, 11) ^ o(C, 25)) + (C & s[5] ^ ~C & s[6]) + u[f] + (k[f] = f < 16 ? k[f] : k[f - 16] + (o(p, 7) ^ o(p, 18) ^ p >>> 3) + k[f - 7] + (o(w, 17) ^ o(w, 19) ^ w >>> 10) | 0);
            (s = [M + ((o(A, 2) ^ o(A, 13) ^ o(A, 22)) + (A & s[1] ^ A & s[2] ^ s[1] & s[2])) | 0].concat(s))[4] = s[4] + M | 0
        }
        for (f = 0; f < 8; f++) s[f] = s[f] + d[f] | 0
    }
    for (f = 0; f < 8; f++)
        for (a = 3; a + 1; a--) {
            var S = s[f] >> 8 * a & 255;
            c += (S < 16 ? 0 : "") + S.toString(16)
        }
    return c
}