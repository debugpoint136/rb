function tk_height(tk) {
    if (tkishidden(tk)) return 0;
    if (!tk.canvas) return 0;
    return tk.canvas.height;
}