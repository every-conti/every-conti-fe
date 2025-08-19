import PraiseTeamDto from "src/dto/common/praise-team.dto";

export default interface UserSimpleDto {
  id: string;
  nickname: string;
  profileImage: string;
  praiseTeam: PraiseTeamDto;
}
