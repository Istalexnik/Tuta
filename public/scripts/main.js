document.getElementById('searchForm').addEventListener('submit', async function (e) {
  e.preventDefault();
  const searchText = e.target.searchText.value;
  console.log(`Entered Text: ${searchText}`); // Log the entered text

  try {
    const response = await fetch('/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ searchText })
    });

    const data = await response.json();
    console.log(`Response data: ${JSON.stringify(data)}`); // Log the response data

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (data.length > 0) {
      data.forEach(info => {
        const div = document.createElement('div');
        div.textContent = info;
        resultsDiv.appendChild(div);
      });
    } else {
      resultsDiv.textContent = 'No results found';
    }
  } catch (error) {
    console.error('Error:', error); // Log any errors
  }
});
