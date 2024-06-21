<script>
  var queryString = window.location.search;
  var urlParams = new URLSearchParams(queryString);

  $("[data-input]").each(function (index) {
    index++;
    var paramFlag = $(`[data-input="search-${index}"]`).data('url');
    $(`[data-search="cms-item-${index}"]`).hide();
    $(`[data-div="noResult-${index}"]`).hide();

    var $input = $(`[data-input="search-${index}"]`);
    var $searchItems = $(`[data-search="cms-item-${index}"]`);
    var currentIndex = -1;
    var $form = $input.closest('form');

    $input.on("input", function () {
      var searchVal = $(this).val().toLowerCase();
      currentIndex = -1;
      $searchItems.hide();

      for (let item of $(`[data-text="search-${index}"]`)) {
        if ($(item).text().toLowerCase().includes(searchVal) && searchVal !== "") {
          $(`[data-text="search-${index}"]:contains("${$(item).text()}")`)
            .parents(`[data-search="cms-item-${index}"]`)
            .show();
        } else {
          $(`[data-text="search-${index}"]:contains("${$(item).text()}")`)
            .parents(`[data-search="cms-item-${index}"]`)
            .hide();
        }
      }

      if ($(`[data-search="cms-item-${index}"][style="display: none;"]`).length === $(`[data-search="cms-item-${index}"]`).length && searchVal !== "") {
        $(`[data-div="noResult-${index}"]`).show();
      } else {
        $(`[data-div="noResult-${index}"]`).hide();
      }

      if (paramFlag) {
        var url = new URL(window.location);
        url.searchParams.set(`search-${index}`, searchVal);
        if (searchVal === '') {
          url.searchParams.delete(`search-${index}`);
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
        e.preventDefault();
      } else if (e.key === "ArrowUp") {
        if (currentIndex > 0) {
          currentIndex--;
        }
        updateSelection(visibleItems);
        e.preventDefault();
      } else if (e.key === "Enter") {
        if (currentIndex >= 0) {
          var selectedText = $(visibleItems[currentIndex]).find(`[data-text="search-${index}"]`).text();
          $input.val(selectedText).trigger('input');
          $form.trigger('submit'); // Submit the form on Enter key
        }
      }
    });

    $searchItems.on("mousedown", function () {
      var selectedText = $(this).find(`[data-text="search-${index}"]`).text();
      $input.val(selectedText);
    });

    $searchItems.on("mouseup", function () {
      $input.trigger('input');
      $form.trigger('submit'); // Submit the form on click
    });

    function updateSelection(visibleItems) {
      visibleItems.removeClass('selected');
      if (currentIndex >= 0) {
        $(visibleItems[currentIndex]).addClass('selected');
      }
    }

    if (paramFlag) {
      if (urlParams.get(`search-${index}`)) {
        $input.val(urlParams.get(`search-${index}`));
        $input.trigger('input');
      }
    }
  });

  $("<style>")
    .prop("type", "text/css")
    .html("\
      .selected {\
        background-color: #3f3e3a;\
      }\
    ")
    .appendTo("head");
</script>
