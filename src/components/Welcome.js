import { styled } from "@mui/material/styles";





export default function Welcome () {

	const Text = styled("div")(({ theme }) => ({
		backgroundColor: theme.palette.appBar,
        opacity: 0.9,
        color: theme.palette.appBarText,
		textAlign: "center",
	}));

    return (
        <div className='welcome'>
            <Text sx={{ display: "inline-block", p: 1, borderRadius:'10px'}}>
						COMMONS
			</Text>
        </div>
    )
}