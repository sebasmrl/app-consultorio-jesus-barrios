(() => {
  const includes = document.getElementsByTagName('include');
  [].forEach.call(includes, i => {
    let filePath = i.getAttribute('src');
    fetch(filePath).then(file => {
      file.text().then(content => {
        const object = document.createElement('div');
        object.innerHTML = content;

        i.insertAdjacentElement('afterend', object.firstChild);

        const scripts = object.getElementsByTagName('script');

        Array.from(scripts).forEach(script => {
          const s = document.createElement('script');
          s.type = script.type;
          s.defer = script.defer;

          if (script.src) {
            // if (!script.src.includes('https')) {
            //   const { origin } = window.location;

            //   const folder = filePath
            //     .split('/')
            //     .map(dir => {
            //       if (['.', '..'].includes(dir)) return null;

            //       if (dir.includes('.html')) return null;

            //       console.log(dir);
            //       return dir;
            //     })
            //     .join('/');

            //   const newPath =
            //     origin + folder + script.src.replace(origin + '/', '');

            //   s.src = newPath;
            // } else
            s.src = script.src;
          } else s.appendChild(document.createTextNode(script.innerText));

          document.body.appendChild(s);

          script.remove();
        });
        i.remove();
      });
    });
  });
})();
