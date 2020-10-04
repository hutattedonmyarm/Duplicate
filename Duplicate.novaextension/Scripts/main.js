exports.activate = function() {
    // Do work when the extension is activated
}

exports.deactivate = function() {
    // Clean up state before the extension is deactivated
}


nova.commands.register("duplicate.duplicateSelection", async (editor) => {
    // Selections, from the bottom of the document to the top
    let selectedRanges = editor.selectedRanges.sort((r1, r2) => r2.start - r1.start);
    const originalSelection = selectedRanges;

    // Selects the whole line for all "empty" ranges (ranges without selection, only a cursor position)
    selectedRanges = selectedRanges.map(r => r.empty ? editor.getLineRangeForRange(r) : r);

    const lengths = selectedRanges.map(r => r.length);
    let newSelection = [];
    await editor.edit(function(e) {
        for (const [index, range] of selectedRanges.entries()) {
            const text = editor.getTextInRange(range);
            console.log(text);
            e.replace(range, text + text);
            const originalRange = originalSelection[index];

            // Move the selection/cursor to the newly created text
            newSelection.push(new Range(originalRange.start + text.length, originalRange.end + text.length));
        }
    });

    /*
     * Adding text causes the selections to be off.
     * This moves all selections (starting at the top of the document)
     * by the summed length of all added text before it, so all selections end up being at the same position,
     * but in the newly added text
     */
    newSelection.reverse();
    lengths.reverse();
    let totalLength = 0;
    for (const [i, r] of newSelection.entries()) {
        newSelection[i] = new Range(r.start + totalLength, r.end + totalLength);
        totalLength += lengths[i];
    }
    editor.selectedRanges = newSelection;
});
