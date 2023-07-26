const LottieZipSourceLoader = (zipSource: string = '') => {
  if (!zipSource) return Promise.reject({ message: `'zipSource' is undefined!` });

  return new Promise((resolve, reject) => {
    fetch(zipSource, {
      method: 'GET',
      mode: 'cors'
    })
      .then(async (res) => {
        const blob = await res.blob();
        const reader = new FileReader();

        reader.onload = async (event) => {
          const arrayBuffer = event?.target?.result;
          const { JSZip } = globalThis as any;

          if (JSZip) {
            const zip = await JSZip.loadAsync(arrayBuffer);
            const jsonData = zip.file('data.json');

            if (jsonData) {
              const jsonString = await jsonData.async('text');
              const json = JSON.parse(jsonString);
              const { assets } = json;
              const promiseAll = [] as any[];
              assets.forEach(async (asset: any) => {
                // p 换成 base 64
                // u 换成 ''
                const { p, u } = asset;
                const imageZipPath = `${u}${p}`;
                const imageFile = zip.file(imageZipPath);
                if (!imageFile) return;
                const promise = imageFile.async('base64').then((base64Image: string) => {
                  asset.p = `data:image/png;base64,${base64Image}`;
                  asset.u = '';
                });
                promiseAll.push(promise);
              });

              Promise.all(promiseAll).then(() => resolve({ lottieBase64: json }));
            } else {
              reject({ message: `entry File data.json is not defined!` });
            };
          } else {
            reject({ message: `JSZip is not defined!` });
          };
        };

        reader.readAsArrayBuffer(blob);
      })
  });
};

export default LottieZipSourceLoader;