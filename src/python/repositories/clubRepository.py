#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseRepository import CheeseRepository

#@repository clubs
#@dbscheme (id, title, code, eju, street, city, zip, email, phone, web)
#@dbmodel Club
class ClubRepository(CheeseRepository):

    #@query "select * from clubs where id=:clubId;"
    #@return one
    @staticmethod
    def findClubById(clubId):
        return CheeseRepository.findClubById([clubId])

    #@query "select * from clubs where :filter;"
    #@return array
    @staticmethod
    def findAllClubsBy(filter):
        return CheeseRepository.findAllClubsBy([filter])

    #@query "select case when exists
    #       (select * from clubs c where c.title = :title)
    #       then cast(1 as bit)
    #       else cast(0 as bit) end;"
    #@return bool
    @staticmethod
    def doesClubExists(title):
        return CheeseRepository.doesClubExists([title])

    #@query "select max(id) from clubs;"
    #@return num
    @staticmethod
    def findNewId():
        try:
            return CheeseRepository.findNewId([])+1
        except:
            return 0

    @staticmethod
    def save(obj):
        return CheeseRepository.save([obj])

    @staticmethod
    def update(obj):
        return CheeseRepository.update([obj])

    @staticmethod
    def delete(obj):
        return CheeseRepository.delete([obj])
