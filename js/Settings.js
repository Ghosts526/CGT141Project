function clearData()
{
    for (let i = 0; i < localStorage.length; i++)
    {
        localStorage.setItem(localStorage.key(i), "0");
    }
    console.log("Data Cleared");
}

function printData()
{
    for (let i = 0; i < localStorage.length; i++)
    {
        console.log(localStorage.key(i) + " - " + localStorage.getItem(localStorage.key(i)));
    }

    if (localStorage.length == 0)
    {
        console.log("Empty Data");
    }
}