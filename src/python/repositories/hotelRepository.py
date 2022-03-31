#!/usr/bin/env python
# -*- coding: utf-8 -*-

from cheese.modules.cheeseRepository import CheeseRepository

#@repository hotels
#@dbscheme (id, title, street, city, zip, email, phone, web)
#@dbmodel Hotel
class HotelRepository(CheeseRepository):

    #@query "select * from hotels where id=:hotelId;"
    #@return one
    @staticmethod
    def findHotelById(hotelId):
        return CheeseRepository.findHotelById([hotelId])

    #@query "select distinct h.id, h.title, h.street, h.city, h.zip, h.email, h.phone, h.web
    #           from rooms r inner join hotels h on h.id = r.hotel_id
    #           where :bedFilter and :filter;"
    #@return array
    @staticmethod
    def findAllHotelsBy(bedFilter, filter):
        return CheeseRepository.findAllHotelsBy([bedFilter, filter])

    #@query "select case when exists
    #       (select * from hotels h where h.title = :title)
    #       then cast(1 as bit)
    #       else cast(0 as bit) end;"
    #@return bool
    @staticmethod
    def doesHotelExists(title):
        return CheeseRepository.doesHotelExists([title])

    #@query "select max(id) from hotels;"
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
