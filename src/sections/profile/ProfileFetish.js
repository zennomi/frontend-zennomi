// @mui
import { Typography, Card, CardContent, Alert, CardHeader, Stack } from "@mui/material"
export default function ProfileFetish() {
    return (
        <Stack spacing={2}>
            <Alert severity='info'>Trang web này chủ yếu liệt kê các bộ mình đã xem, không phải toàn bộ romcom trên đời này (nhưng 
            cũng phải tầm 80% rồi =))) Mời các bạn tham khảo gu của mình để xem có phù hợp với bạn không...</Alert>
            <Card>
                <CardHeader title="Sơ lược" />
                <CardContent>
                    Nói là romcom thì nó vẫn là thể loại rất rộng, không phải cứ romcom là mình nhai, nó còn phụ thuộc vào cốt truyện và nhân vật. 
                    Thường thì mình thích cốt truyện đời thường, không nhiều yếu tố ảo lòi, <b>tập trung khai thác tương tác giữa nam nữ chính nhiều</b>. 
                    Main thì không thảm hại quá, gái thì không bánh bèo deredere quá. Tương tác hoá học giữa hai nhân vật chính là yếu tố quan trọng 
                    quyết định xem tôi có theo dõi bộ này không.
                </CardContent>
            </Card>
            <Card>
                <CardHeader title="Manga" />
                <CardContent>
                    Manga thì mình đọc khá rộng, đủ loại romcom từ tình yêu sơ trung đến cao trung thậm chí là trung niên. Nói chung là cứ 
                    ngọt thì đọc. Hạn chế tragedy, shoujo và một số bộ thành cặp từ trước đó vì nó hơi sến =))
                </CardContent>
            </Card>
            <Card>
                <CardHeader title="Novel" />
                <CardContent>
                    Ngoài LN, WN thì mình còn đọc truyện ngắn đề tài lãng mạn Nhật Bản, cả Việt Nam cũng có. Vẫn là ngọt thôi, LN hay WN 
                    thì mình không đọc mấy bộ main loser x gái xinh nhất vì hơi ngán.
                </CardContent>
            </Card>
            <Card>
                <CardHeader title="Anime" />
                <CardContent>
                    Gần đây thì ít xem anime, tuy nhiên vài movie lãng mạn thì tất nhiên là coi rồi. Mình có xem phim Hàn nữa, sẽ bổ sung sau.
                </CardContent>
            </Card>
        </Stack>
    )
}