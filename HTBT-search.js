    // Capture URL parameters
    const urlParams = new URLSearchParams(window.location.search);

    // Initialize search functionality for each data-input element
    $(`[data-type="form"]`).each(function () {
      const $input = $(this).find(`[search="input"]`);
      const $searchItems = $(this).find(`[search="cms-item"]`);
      const $noResultDiv = $(this).find(`[search="noResults"]`);
      const $resultsWrapper = $(this).find(`[search="results"]`);
      const paramFlag = $input.data('url');
      let currentIndex = -1;
      
      // Hide search items, no result div, and results-wrapper initially
      $searchItems.hide();
      $noResultDiv.hide();
      $resultsWrapper.hide();

      // Clear search input functionality
      $(document).on('click', '[data-input="clear"]', function () {
        clearSearchInput($input);
        $(this).hide(); // Hide the clear button after clearing the input
      });

      // Show or hide the clear button based on input value
      $input.on('input', function () {
        const $clearButton = $(this).closest(`[data-type="form"]`).find(`[data-input="clear"]`);
        if ($(this).val().length > 0) {
          $clearButton.show();
        } else {
          $clearButton.hide();
        }
      });

      // Focus and input event bindings
      $input.on("focus input", function () {
        updateSearchResults($input, $searchItems, $noResultDiv);
      });

      // Keydown event binding
      $input.on("keydown", function (e) {
        handleKeyDown(e, $input, $searchItems);
      });

      // Search item click events
      $searchItems.on("mousedown mouseup", function () {
        handleSearchItemClick($input, $(this));
      });

      // Click outside handler
      $(document).on('click', function (e) {
        handleOutsideClick(e, $input, $searchItems, $noResultDiv);
      });

      // Initialize search input with URL parameters if available
      if (paramFlag && urlParams.get(`search`)) {
        $input.val(urlParams.get(`search`));
        $input.trigger('input');
      }

      // Function to update search results based on input value
      function updateSearchResults($input, $searchItems, $noResultDiv) {
        const searchVal = $input.val().toLowerCase();
        currentIndex = -1;
        $searchItems.hide();
        $resultsWrapper.hide();

        $searchItems.each(function () {
          const $item = $(this).find(`[data-text="search"]`);
          if ($item.text().toLowerCase().includes(searchVal) && searchVal !== "") {
            $(this).show();
            $resultsWrapper.show();
            highlightText($item, searchVal);
          } else {
            removeHighlight($item);
          }
        });

        if ($searchItems.filter(':visible').length === 0 && searchVal !== "") {
          $noResultDiv.show();
        } else {
          $noResultDiv.hide();
        }
      }

      // Function to highlight matching text
      function highlightText($item, searchVal) {
        const text = $item.text();
        const regex = new RegExp(`(${searchVal})`, 'gi');
        const highlightedText = text.replace(regex, "<span class='highlight'>$1</span>");
        $item.html(highlightedText);
      }

      // Function to remove highlight from text
      function removeHighlight($item) {
        $item.html($item.text());
      }

      // Function to update the visual selection in search results
      function updateSelection(visibleItems) {
        visibleItems.removeClass('selected');
        if (currentIndex >= 0) {
          $(visibleItems[currentIndex]).addClass('selected');
        }
      }

      // Function to clear search input
      function clearSearchInput($input) {
        $input.val('').trigger('input');
      }

      // Function to handle keydown events
      function handleKeyDown(e, $input, $searchItems) {
        const visibleItems = $searchItems.filter(':visible');
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
        } else if (e.key === "Enter" && currentIndex >= 0) {
          const selectedText = $(visibleItems[currentIndex]).find(`[data-text="search"]`).text();
          $input.val(selectedText).trigger('input');
          $input.closest('form').trigger('submit'); // Submit the form on Enter key
        }
      }

      // Function to handle search item click events
      function handleSearchItemClick($input, $item) {
        const selectedText = $item.find(`[data-text="search"]`).text();
        $input.val(selectedText).trigger('input');
        $input.closest('form').trigger('submit'); // Submit the form on click
      }

      // Function to handle clicks outside the search input
      function handleOutsideClick(e, $input, $searchItems, $noResultDiv) {
        if (!$input.is(e.target) && $input.has(e.target).length === 0) {
          $searchItems.hide();
          $noResultDiv.hide();
          $resultsWrapper.hide();
        }
      }
    });
