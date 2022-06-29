
from Cheese.cheeseRepository import CheeseRepository

#@repository bills;
#@dbscheme (id, event_id, reg_club_id, total);
#@dbmodel Bill;
class BillsRepository(CheeseRepository):

    #@query "select * from bills where event_id=:eventId and reg_club_id=:regClubId;";
    #@return one;
    @staticmethod
    def findByEventAndRegClub(eventId, regClubId):
        return CheeseRepository.query(eventId=eventId, regClubId=regClubId)
