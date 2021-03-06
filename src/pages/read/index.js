// @mui
import { styled } from '@mui/material/styles';
import { Box, Button, Stack, Container, Typography, InputAdornment, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
// components
import Page from '../../components/Page';
import InputStyle from '../../components/InputStyle';
import SocialsButton from '../../components/SocialsButton';
import RoundedButton from '../../components/RoundedButton';
// assets
import { MotivationIllustration } from '../../assets';
import { MangadexLogo, NhentaiLogo, ImgurLogo, RedditLogo, BlogtruyenLogo } from '../../assets/logos'
import { useState } from 'react';
// utils
import { fSlug } from '../../utils/formatSource';
// paths
import { PATH_WIBU } from '../../routes/paths';
// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
}));

// ----------------------------------------------------------------------

export default function Read() {
  const [value, setValue] = useState("");
  const [helperText, setHelperText] = useState("");

  const navigate = useNavigate();

  const sources = [
    {
      name: 'blogtruyen',
      children: <img src={BlogtruyenLogo} width={50} height={50} />,
      color: '#4176ed',
      value: 'https://blogtruyen.vn/24632/cau-lac-bo-nhung-ke-mat-ngu'
    }
    ,
    {
      name: 'mangadex',
      children: <img src={MangadexLogo} width={50} height={50} />,
      color: '#FF6740',
      value: 'https://mangadex.org/title/fa59ac85-e056-44d0-bd70-acd0f04bc55c/osananajimi-ga-hisabisa-ni-saikai-shitara-otagai-kyonyuu-ni-natteta'
    },
    {
      name: 'imgur',
      children: <img src={ImgurLogo} width={50} height={50} />,
      color: '#1bb76e',
      value: 'https://imgur.com/a/gLtQDwf'
    },
    {
      name: 'nhentai',
      children: <img src={NhentaiLogo} width={50} height={50} />,
      color: '#EC2854',
      value: '222798'
    },
    {
      name: 'reddit',
      children: <img src={RedditLogo} width={50} height={50} />,
      color: '#FF4500',
      value: 'https://www.reddit.com/r/manga/comments/ta25dd/disc_the_story_of_a_couple_with_a_huge_age/?utm_source=share&utm_medium=web2x&context=3'
    },
  ];

  const parseSource = () => {
    const readLink = fSlug(value);
    if (readLink) {
      navigate(`${PATH_WIBU.read.root}${readLink}`);
    } else {
      setHelperText("Kh??ng ph???i link h???p l???.");
    }
    console.log(fSlug(value));
  }

  return (
    <Page title="Trang ?????c manga" sx={{ height: 1 }}>
      <RootStyle>
        <Container>
          <Box sx={{ maxWidth: 480, margin: 'auto', textAlign: 'center' }}>
            <Typography variant="h3" paragraph>
              Trang ?????c manga kh??ng qu???ng c??o
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>H??? tr??? c??c ???????ng link t??? mangadex, nhentai, imgur,...</Typography>

            <MotivationIllustration sx={{ my: 10, height: 240 }} />

            <InputStyle
              fullWidth
              placeholder="Link Mangadex, Imgur, code 6 s???,..."
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button variant="contained" size="large" onClick={parseSource}>
                      ?????c ngay!
                    </Button>
                  </InputAdornment>
                ),
              }}
              sx={{ my: 5, '& .MuiOutlinedInput-root': { pr: 0.5 } }}
              value={value}
              onChange={(event) => { setValue(event.target.value); if (helperText) setHelperText("") }}
              error
              helperText={helperText}
            />

            <Stack alignItems="center" marginBottom={2}>
              <Stack direction="row" flexWrap="wrap" alignItems="center">
                {
                  sources.map((source) => (< RoundedButton size="large" {...source} onClick={() => setValue(source.value)} />))
                }
              </Stack>
            </Stack>
            <Alert
              severity='info'
              variant='outlined'
            >
              ZenWebApp kh??ng h??? s??? h???u c??c ???nh m?? ch??? hi???n th??? ch??ng t??? ngu???n ng?????i d??ng nh???p.
            </Alert>
          </Box>
        </Container>
      </RootStyle>
    </Page>
  );
}
