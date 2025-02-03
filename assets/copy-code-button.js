// Source: https://github.com/adityatelange/hugo-PaperMod/blob/58c4841c26325eaa788d9b13e65d5dfc95d9367c/layouts/partials/footer.html#L98
function setupCopyButtons(label, copiedLabel) {
  document.querySelectorAll("pre > code").forEach((codeblock) => {
    const container = codeblock.parentNode.parentNode;

    const copybutton = document.createElement("button");
    copybutton.classList.add("copy-code");
    copybutton.innerHTML = label;

    function copyingDone() {
      copybutton.innerHTML = copiedLabel;
      setTimeout(() => {
        copybutton.innerHTML = label;
      }, 2000);
    }

    copybutton.addEventListener("click", (cb) => {
      if ("clipboard" in navigator) {
        navigator.clipboard.writeText(codeblock.textContent);
        copyingDone();
        return;
      }

      const range = document.createRange();
      range.selectNodeContents(codeblock);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      try {
        document.execCommand("copy");
        copyingDone();
      } catch (e) {}
      selection.removeRange(range);
    });

    if (container.classList.contains("highlight")) {
      container.appendChild(copybutton);
    } else if (container.parentNode.firstChild == container) {
      // td containing LineNos
    } else if (
      codeblock.parentNode.parentNode.parentNode.parentNode.parentNode
        .nodeName == "TABLE"
    ) {
      // table containing LineNos and code
      codeblock.parentNode.parentNode.parentNode.parentNode.parentNode.appendChild(
        copybutton,
      );
    } else {
      // code blocks not having highlight as parent class
      codeblock.parentNode.appendChild(copybutton);
    }
  });
}
