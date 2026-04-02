
import { Resvg } from '@resvg/resvg-js';
import satori from "satori";
import parseFrontMatter from "gray-matter";
import { readFile } from "node:fs/promises";
import sharp from "sharp";

let profileImageDataUri: string | undefined;

const getProfileImageDataUri = async () => {
    if (profileImageDataUri) return profileImageDataUri;
    const imageBuffer = await readFile(new URL("./src/assets/images/others/mysti.jpg", import.meta.url));
    const pngBuffer = await sharp(imageBuffer).png().toBuffer();
    profileImageDataUri = `data:image/png;base64,${pngBuffer.toString("base64")}`;
    return profileImageDataUri;
};

export const exportAsPng = async (file: any, interFont: any) => {
    const { title, description } = parseFrontMatter(file).data;
    const profileImageSrc = await getProfileImageDataUri();
    const svg = await satori(ogImage(title, description, profileImageSrc), {
        width: 800,
        height: 400,
        fonts: [
            {
                name: 'Inter',
                data: interFont,
                weight: 400,
                style: 'normal'
            }
        ]
    });

    const reSvg = new Resvg(svg, {
        fitTo: {
            mode: "width",
            value: 1200,
        }
    });

    return reSvg.render().asPng()
}


const ogImage = (title: string, description: string = "", profileImageSrc: string) => ({
    type: "div",
    props: {
        style: {
            backgroundImage: "radial-gradient(circle, #000000 90%, rgba(40, 40, 40, 0.87) 97%)",
            backgroundPosition: "0 0",
            backgroundSize: "20px 20px",
            color: "white",
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            paddingLeft: "30",
            paddingRight: "30",
            fontFamily: "Inter",
            position: "relative"
        },
        children: [
            {
                type: "div",
                props: {
                    style: { marginTop: 30, fontSize: 19 },
                    children: "mystica.me"
                }
            },
            {
                type: "div",
                props: {
                    style: { marginTop: 100, display: "flex", flexDirection: "column" },
                    children: [
                        {
                            type: "div",
                            props: {
                                style: { fontSize: 40, textTransform: "capitalize" },
                                children: title
                            },
                        },
                        {
                            type: "div",
                            props: {
                                style: { marginTop: 30, fontSize: 18, textTransform: "capitalize" },
                                children: description || ""
                            }
                        },
                    ],
                }
            },
            {
                type: "div",
                props: {
                    style: { marginBottom: 30, display: "flex", flexDirection: "row", width: "100%", justifyContent: "space-between", alignItems: "center", position: "absolute", bottom: "4%", left: "4%" },
                    children: [
                        {
                            type: "div",
                            props: {
                                children: "By Mystica"
                            }
                        },
                        {
                            type: "div",
                            props: {
                                style: { display: "flex" },
                                children: [{
                                    type: "img",
                                    props: {
                                        width: "100",
                                        height: "100",
                                        src: profileImageSrc,
                                        style: { borderRadius: "50%", objectFit: "cover", objectPosition: "20% 50%" }
                                    }
                                }]
                            }
                        }
                    ]
                }
            },

        ],
    }
});
