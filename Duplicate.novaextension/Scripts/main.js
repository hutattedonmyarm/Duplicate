exports.activate = function() {
    // Do work when the extension is activated
}

exports.deactivate = function() {
    // Clean up state before the extension is deactivated
}


nova.commands.register("duplicate.duplicateSelection", (editor) => {
    var selectedRanges = editor.selectedRanges.reverse();
    // Selects the whole line for all "empty" ranges (ranges without selection, only a cursor position)
    selectedRanges = selectedRanges.map(r => r.empty ? editor.getLineRangeForRange(r) : r);

    editor.edit(function(e) {
        for (var range of selectedRanges) {
            var text = editor.getTextInRange(range);
            e.insert(range.end, text);
        }
    });
});
