// @mui
import { Container } from '@mui/material';
// hooks
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';
// sections
import TitleNewForm from '../../sections/title/TitleNewForm';
// utils
import axios from '../../utils/axios';
// ---------------------------------------------------------------------

export default function NewTitle() {
  const { themeStretch } = useSettings();

  const titleSubmit = async (title) => {
    return await axios({
      method: 'post',
      url: `/v1/titles`,
      data: title,
    })
  }

  return (
    <Page title="New Title">
      <Container maxWidth={themeStretch ? false : 'xl'}>
        <TitleNewForm isEdit={false} currentTitle={null} titleSubmit={titleSubmit} />
      </Container>
    </Page>
  );
}
