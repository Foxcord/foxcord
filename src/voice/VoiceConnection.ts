import { _testURL } from '../utils/Utils'

export class VoiceConnection {
    constructor() {
    };

    public async play(track: string) {
        if(!track || typeof track !== 'string') throw new SyntaxError('NO_TRACK_PROVIDED_OR_INVALID_TRACK');
        if(track.startsWith('./') ) {
           
        } else if(_testURL(track) && (track.endsWith('.mp3') || track.endsWith('.wav'))) {
        
        } else throw new SyntaxError('INVALID_TRACK_PROVIDED');
    };
};