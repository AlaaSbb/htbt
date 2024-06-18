  var queryString = window.location.search;
  var urlParams = new URLSearchParams(queryString);

  $("[data-input]").each(function (x) {
    x++;
    var paramFlag = $(`[data-input="search-${x}"]`).data('url');
    $(`[data-search="cms-item-${x}"]`).hide();
    $(`[data-div="noResult-${x}"]`).hide();

    // Store references to the input element and search items
    var $input = $(`[data-input="search-${x}"]`);
    var $searchItems = $(`[data-search="cms-item-${x}"]`);
    var currentIndex = -1;

    $input.on("input", function () {
      var searchVal = $(this).val().toLowerCase();
      currentIndex = -1; // Reset index on input
      $searchItems.hide();

      for (let y of $(`[data-text="search-${x}"]`)) {
        if (
          $(y).text().toString().toLowerCase().includes(searchVal) &&
          searchVal !== ""
        ) {
          $(`[data-text="search-${x}"]:contains("${$(y).text()}")`)
            .parents(`[data-search="cms-item-${x}"]`)
            .show();
        } else {
          $(`[data-text="search-${x}"]:contains("${$(y).text()}")`)
            .parents(`[data-search="cms-item-${x}"]`)
            .hide();
        }
      }

      if (
        $(`[data-search="cms-item-${x}"][style="display: none;"]`).length ===
        $(`[data-search="cms-item-${x}"]`).length &&
        searchVal !== ""
      ) {
        console.log("No Result");
        $(`[data-div="noResult-${x}"]`).show();
      } else {
        $(`[data-div="noResult-${x}"]`).hide();
      }

      if (paramFlag) {
        var url = new URL(window.location);
        url.searchParams.set(`search-${x}`, searchVal);
        if (searchVal === '') {
          url.searchParams.delete(`search-${x}`);
        }
        window.history.pushState({}, '', url);
      }
    });

    $input.on("keydown", function (e) {
      var visibleItems = $searchItems.filter(':visible');

      if (e.key === "ArrowDown") {
        if (currentIndex < visibleItems.length - 1) {
          currentIndex++;
        }
        updateSelection(visibleItems);
        e.preventDefault(); // Prevent cursor from moving in the input
      } else if (e.key === "ArrowUp") {
        if (currentIndex > 0) {
          currentIndex--;
        }
        updateSelection(visibleItems);
        e.preventDefault(); // Prevent cursor from moving in the input
      } else if (e.key === "Enter") {
        if (currentIndex >= 0) {
          var selectedText = $(visibleItems[currentIndex]).find(`[data-text="search-${x}"]`).text();
          $input.val(selectedText).trigger('input'); // Update input value and trigger search
        }
      }
    });

    function updateSelection(visibleItems) {
      visibleItems.removeClass('selected');
      if (currentIndex >= 0) {
        $(visibleItems[currentIndex]).addClass('selected');
      }
    }

    if (paramFlag) {
      if (urlParams.get(`search-${x}`)) {
        $input.val(urlParams.get(`search-${x}`));
        $input.trigger('input');
      }
    }
  });

  // Add some CSS for the selected item highlight
  $("<style>")
    .prop("type", "text/css")
    .html("\
      .selected {\
        background-color: #d3d3d3;\
      }\
    ")
    .appendTo("head");
