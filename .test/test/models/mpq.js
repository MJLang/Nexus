"use strict";
const mpq_1 = require('./../../src/mpq');
const chai_1 = require('chai');
const path = require('path');
describe('MPQ Archive', () => {
    it('Should be able to load a StormReplay File', () => {
        let dragon_shire = path.normalize(path.join(__dirname, '..', 'support', 'dragon_shire.StormReplay'));
        let archive = new mpq_1.MPQArchive(dragon_shire);
        chai_1.expect(archive).to.not.be.null;
    });
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL21vZGVscy9tcHEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLHNCQUEyQixpQkFBaUIsQ0FBQyxDQUFBO0FBQzdDLHVCQUF1QixNQUFNLENBQUMsQ0FBQTtBQUM5QixNQUFZLElBQUksV0FBTSxNQUFNLENBQUMsQ0FBQTtBQUU3QixRQUFRLENBQUMsYUFBYSxFQUFFO0lBQ3RCLEVBQUUsQ0FBQywyQ0FBMkMsRUFBRTtRQUM5QyxJQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsMEJBQTBCLENBQUMsQ0FBQyxDQUFDO1FBQ3JHLElBQUksT0FBTyxHQUFHLElBQUksZ0JBQVUsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUUzQyxhQUFNLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDO0lBQ2pDLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQyxDQUFDLENBQUEiLCJmaWxlIjoidGVzdC9tb2RlbHMvbXBxLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTVBRQXJjaGl2ZSB9IGZyb20gJy4vLi4vLi4vc3JjL21wcSc7XG5pbXBvcnQgeyBleHBlY3QgfSBmcm9tICdjaGFpJztcbmltcG9ydCAqIGFzIHBhdGggZnJvbSAncGF0aCc7XG5cbmRlc2NyaWJlKCdNUFEgQXJjaGl2ZScsICgpID0+IHtcbiAgaXQoJ1Nob3VsZCBiZSBhYmxlIHRvIGxvYWQgYSBTdG9ybVJlcGxheSBGaWxlJywgKCkgPT4ge1xuICAgIGxldCBkcmFnb25fc2hpcmUgPSBwYXRoLm5vcm1hbGl6ZShwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnc3VwcG9ydCcsICdkcmFnb25fc2hpcmUuU3Rvcm1SZXBsYXknKSk7XG4gICAgbGV0IGFyY2hpdmUgPSBuZXcgTVBRQXJjaGl2ZShkcmFnb25fc2hpcmUpO1xuXG4gICAgZXhwZWN0KGFyY2hpdmUpLnRvLm5vdC5iZS5udWxsO1xuICB9KTtcbn0pIl19
