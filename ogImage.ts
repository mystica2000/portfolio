
import { Resvg } from '@resvg/resvg-js';
import satori from "satori";
import parseFrontMatter from "gray-matter";

export const exportAsPng = async (file: any, interFont: any) => {
    const { title, description } = parseFrontMatter(file).data;
    const svg = await satori(ogImage(title, description), {
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


const ogImage = (title: string, description: string = "") => ({
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
                                style: { marginTop: 30, fontSize: 20, textTransform: "capitalize" },
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
                                        width: "50",
                                        height: "50",
                                        src: "https://raw.githubusercontent.com/mystica2000/image-dump/main/mystica.jpg",
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